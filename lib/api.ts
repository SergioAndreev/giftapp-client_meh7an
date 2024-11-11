import constant from "@/constants";
import WebApp from "@twa-dev/sdk";

/**
 * Enumeration of possible network error types
 */
export enum NetworkErrorType {
  TIMEOUT = "TIMEOUT",
  SERVER_ERROR = "SERVER_ERROR",
  OFFLINE = "OFFLINE",
  UNKNOWN = "UNKNOWN",
}

/**
 * Custom error class for API-related errors
 *
 * @extends Error
 * @example
 * ```ts
 * throw new ApiError(404, "Not Found", { detail: "Resource not found" }, "/api/users");
 * ```
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: Record<string, unknown>,
    public endpoint?: string
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Custom error class for network-related errors
 *
 * @extends Error
 * @example
 * ```ts
 * throw new NetworkError(
 *   NetworkErrorType.TIMEOUT,
 *   new Error("Request timed out"),
 *   "Failed after 3 attempts"
 * );
 * ```
 */
export class NetworkError extends Error {
  constructor(
    public type: NetworkErrorType,
    public originalError: Error,
    public details?: string
  ) {
    super(`Network Error (${type}): ${originalError.message}`);
    this.name = "NetworkError";
  }
}

interface ApiClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, data?: unknown) => Promise<T>;
  put: <T>(endpoint: string, data?: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

class RequestQueue {
  private queue: Array<{
    request: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];
  private isProcessing = false;
  private maxConcurrent = 3;
  private activeRequests = 0;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        request: request as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.activeRequests >= this.maxConcurrent) return;
    this.isProcessing = true;

    while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) continue;

      this.activeRequests++;
      try {
        const result = await item.request();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      } finally {
        this.activeRequests--;
      }
    }

    this.isProcessing = false;
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (status: number): boolean => {
  return [408, 429, 500, 502, 503, 504].includes(status);
};

const calculateBackoff = (
  attempt: number,
  { baseDelay, maxDelay, backoffFactor }: RetryConfig
): number => {
  const delay = baseDelay * Math.pow(backoffFactor, attempt);
  return Math.min(delay, maxDelay);
};

const createApiClient = (
  retryConfig: RetryConfig = defaultRetryConfig
): ApiClient => {
  const baseURL = constant.BASE_URL;
  const requestQueue = new RequestQueue();

  const getHeaders = () => {
    if (!WebApp.initData) {
      throw new Error("WebApp initData is not available");
    }
    return {
      Authorization: `TelegramWebApp ${WebApp.initData}`,
      "Content-Type": "application/json",
    };
  };

  const handleResponse = async (response: Response, endpoint: string) => {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      throw new ApiError(
        response.status,
        response.statusText,
        errorData,
        endpoint
      );
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error("Invalid JSON response from server: " + error);
    }
  };

  const getNetworkErrorType = (
    error: Error,
    status?: number
  ): NetworkErrorType => {
    if (!navigator.onLine) return NetworkErrorType.OFFLINE;
    if (error.name === "TimeoutError") return NetworkErrorType.TIMEOUT;
    if (status && status >= 500) return NetworkErrorType.SERVER_ERROR;
    return NetworkErrorType.UNKNOWN;
  };

  const executeRequest = async <T>(
    endpoint: string,
    options: RequestInit & { timeout?: number },
    attempt = 0
  ): Promise<T> => {
    const timeout = options.timeout || 30000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const headers = getHeaders();
      const response = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
        signal: controller.signal,
      });

      if (
        !response.ok &&
        shouldRetry(response.status) &&
        attempt < retryConfig.maxRetries
      ) {
        const delay = calculateBackoff(attempt, retryConfig);
        await wait(delay);
        return executeRequest(endpoint, options, attempt + 1);
      }

      return handleResponse(response, endpoint);
    } catch (error) {
      if (error instanceof ApiError) throw error;

      const errorType = getNetworkErrorType(error as Error, undefined);
      throw new NetworkError(
        errorType,
        error as Error,
        `Failed after ${attempt + 1} attempts`
      );
    } finally {
      clearTimeout(id);
    }
  };

  const queueRequest = async <T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> => {
    return requestQueue.add(() => executeRequest<T>(endpoint, options));
  };

  return {
    get: async <T>(endpoint: string): Promise<T> => {
      return queueRequest<T>(endpoint, { method: "GET" });
    },

    post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
      return queueRequest<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
      return queueRequest<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: async <T>(endpoint: string): Promise<T> => {
      return queueRequest<T>(endpoint, { method: "DELETE" });
    },
  };
};

let apiInstance: ApiClient | null = null;

/**
 * Initializes the API client singleton with default configuration
 *
 * @returns {ApiClient} The initialized API client instance
 * @example
 * ```ts
 * const api = initializeApi();
 * ```
 */
export const initializeApi = () => {
  console.log("Initializing API");
  apiInstance = createApiClient();
  return apiInstance;
};

/**
 * Returns the initialized API client singleton
 *
 * @returns {ApiClient} The API client instance
 * @throws {Error} If API is not initialized or WebApp is not initialized
 * @example
 * ```ts
 * const api = getApi();
 * const data = await api.get('/users');
 * ```
 */
export const getApi = (): ApiClient => {
  if (!apiInstance) {
    throw new Error("Waiting for API lazy initialization...");
  }
  if (!WebApp.initData) {
    throw new Error(
      "WebApp not initialized. Make sure to call WebApp.init first."
    );
  }
  return apiInstance;
};
