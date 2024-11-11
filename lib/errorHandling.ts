import { ApiError, NetworkError, NetworkErrorType } from "./api";

/**
 * Types of errors that can occur in the gift app
 */
export enum ServiceErrorType {
  // Payment related
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_TIMEOUT = "PAYMENT_TIMEOUT",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  INVOICE_EXPIRED = "INVOICE_EXPIRED",

  // Gift related
  GIFT_NOT_FOUND = "GIFT_NOT_FOUND",
  GIFT_ALREADY_CLAIMED = "GIFT_ALREADY_CLAIMED",
  GIFT_EXPIRED = "GIFT_EXPIRED",

  // Auth related
  AUTH_FAILED = "AUTH_FAILED",
  UNAUTHORIZED = "UNAUTHORIZED",

  // General API
  RATE_LIMIT = "RATE_LIMIT",
  SERVER_ERROR = "SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN = "UNKNOWN",
}

/**
 * Main error class for service layer errors
 */
export class ServiceError extends Error {
  constructor(
    public originalError: Error,
    public serviceType: string,
    public operation: string,
    public errorType: ServiceErrorType,
    public userMessage: string
  ) {
    super(userMessage);
    this.name = "ServiceError";
  }

  public getTechnicalDetails(): string {
    return `${this.serviceType}.${this.operation} failed: ${this.originalError.message}`;
  }
}

/**
 * Logger utility for error tracking
 */
export const Logger = {
  error: (error: ServiceError, context?: Record<string, unknown>) => {
    console.error({
      timestamp: new Date().toISOString(),
      type: error.errorType,
      service: error.serviceType,
      operation: error.operation,
      message: error.message,
      technicalDetails: error.getTechnicalDetails(),
      context,
      stack: error.stack,
    });
  },
};

/**
 * Maps HTTP status codes to user-friendly messages
 */
const statusMessages: Record<number, string> = {
  400: "Invalid request data provided",
  401: "Please log in again to continue",
  403: "You don't have permission for this action",
  404: "The requested item was not found",
  429: "Too many requests, please wait a moment",
  500: "Server error occurred, please try again",
  502: "Service temporarily unavailable",
  503: "Service temporarily unavailable",
  504: "Request timed out, please try again",
};

/**
 * Maps network error types to user-friendly messages
 */
const networkMessages: Record<NetworkErrorType, string> = {
  [NetworkErrorType.OFFLINE]: "No internet connection",
  [NetworkErrorType.TIMEOUT]: "Request timed out",
  [NetworkErrorType.SERVER_ERROR]: "Server is currently unavailable",
  [NetworkErrorType.UNKNOWN]: "Network error occurred",
};

/**
 * Main error handling wrapper for service methods
 */
export const withErrorHandling = async <T>(
  serviceType: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      const userMessage =
        statusMessages[error.status] || "An unexpected error occurred";

      let errorType = ServiceErrorType.UNKNOWN;
      if (error.status === 401) errorType = ServiceErrorType.AUTH_FAILED;
      else if (error.status === 403) errorType = ServiceErrorType.UNAUTHORIZED;
      else if (error.status === 404)
        errorType = ServiceErrorType.GIFT_NOT_FOUND;
      else if (error.status === 429) errorType = ServiceErrorType.RATE_LIMIT;
      else if (error.status >= 500) errorType = ServiceErrorType.SERVER_ERROR;

      if (error.data?.code === "INSUFFICIENT_BALANCE") {
        errorType = ServiceErrorType.INSUFFICIENT_BALANCE;
      } else if (error.data?.code === "INVOICE_EXPIRED") {
        errorType = ServiceErrorType.INVOICE_EXPIRED;
      }

      const serviceError = new ServiceError(
        error,
        serviceType,
        operation,
        errorType,
        typeof error.data?.message === "string"
          ? error.data.message
          : userMessage
      );

      Logger.error(serviceError, { endpoint: error.endpoint });
      throw serviceError;
    }

    if (error instanceof NetworkError) {
      const serviceError = new ServiceError(
        error,
        serviceType,
        operation,
        ServiceErrorType.NETWORK_ERROR,
        networkMessages[error.type]
      );

      Logger.error(serviceError);
      throw serviceError;
    }

    // Handle unknown errors
    const unknownError = new ServiceError(
      error instanceof Error ? error : new Error(String(error)),
      serviceType,
      operation,
      ServiceErrorType.UNKNOWN,
      "An unexpected error occurred"
    );

    Logger.error(unknownError);
    throw unknownError;
  }
};
