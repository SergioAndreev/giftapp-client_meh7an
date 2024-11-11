import { userService } from "../services";
import { TransactionListResponse } from "../../types/types";

interface TransactionCache {
  data: TransactionListResponse;
  timestamp: number;
  limit: number;
}

const CACHE_DURATION = 5 * 60 * 1000;

let transactionsCache: TransactionCache | null = null;
let isInitialLoadInProgress = false;

/**
 * Checks if there's a valid cache entry for the given limit
 *
 * @param limit - Optional pagination limit to validate against cached limit
 * @returns {boolean} True if cache exists, is not expired, and matches the limit
 * @example
 * ```ts
 * if (hasValidCache(10)) {
 *   // Use cached data
 * }
 * ```
 */
export const hasValidCache = (limit?: number): boolean => {
  if (!transactionsCache) {
    return false;
  }
  const isExpired = Date.now() - transactionsCache.timestamp >= CACHE_DURATION;
  const isSameLimit = limit ? transactionsCache.limit === limit : true;
  return (
    !isExpired && isSameLimit && Boolean(transactionsCache.data.items.length)
  );
};

/**
 * Fetches user transactions, using cache if available, and updates state via callback.
 * Handles pagination and cache updates automatically.
 *
 * @param setTransactions - State setter callback function to update transactions in the UI
 * @param limit - Number of transactions per page (default: 10)
 * @throws {Error} When transaction fetch fails or returns no data
 * @example
 * ```ts
 * const [transactions, setTransactions] = useState<TransactionListResponse>({
 *   items: [], hasNext: false, total: 0
 * });
 * await fetchTransactions(setTransactions, 20);
 * ```
 */
export const fetchTransactions = async (
  setTransactions: (data: TransactionListResponse) => void,
  limit: number = 10
) => {
  try {
    if (!transactionsCache) {
      if (isInitialLoadInProgress) {
        return;
      }
      isInitialLoadInProgress = true;
      const { error, success, data } = await userService.getUserTransactions(
        1,
        limit
      );

      if (!success || !data) {
        throw new Error(error || "Failed to fetch transactions");
      }

      transactionsCache = {
        data,
        timestamp: Date.now(),
        limit,
      };
      isInitialLoadInProgress = false;
      setTransactions(data);
      return;
    }

    if (Date.now() - transactionsCache.timestamp >= CACHE_DURATION) {
      clearTransactionsCache();
      fetchTransactions(setTransactions, limit);
      return;
    }

    if (!transactionsCache.data.hasNext) {
      setTransactions(transactionsCache.data);
      return;
    }

    const nextPage =
      Math.floor(transactionsCache.data.items.length / limit) + 1;
    const { error, success, data } = await userService.getUserTransactions(
      nextPage,
      limit
    );

    if (!success || !data) {
      throw new Error(error || "Failed to fetch transactions");
    }

    transactionsCache = {
      data: {
        items: [...transactionsCache.data.items, ...data.items],
        hasNext: data.hasNext,
        total: data.total,
      },
      timestamp: transactionsCache.timestamp,
      limit,
    };
    setTransactions(transactionsCache.data);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    isInitialLoadInProgress = false;
    setTransactions({ items: [], hasNext: false, total: 0 });
  }
};

/**
 * Forces a refresh of transactions by clearing cache and fetching fresh data
 *
 * @param setTransactions - State setter callback function to update transactions in the UI
 * @param limit - Number of transactions per page (default: 10)
 * @example
 * ```ts
 * await refreshTransactions(setTransactions);
 * ```
 */
export const refreshTransactions = async (
  setTransactions: (data: TransactionListResponse) => void,
  limit: number = 10
) => {
  isInitialLoadInProgress = false;
  clearTransactionsCache();
  await fetchTransactions(setTransactions, limit);
};

/**
 * Clears the transactions cache
 *
 * @example
 * ```ts
 * clearTransactionsCache();
 * ```
 */
export const clearTransactionsCache = () => {
  transactionsCache = null;
};

/**
 * Retrieves cached transactions if available and not expired
 *
 * @returns {TransactionListResponse | null} Cached transactions or null if not found/expired
 * @example
 * ```ts
 * const cachedTransactions = getCachedTransactions();
 * if (cachedTransactions) {
 *   // Use cached transactions
 * }
 * ```
 */
export const getCachedTransactions = (): TransactionListResponse | null => {
  if (
    transactionsCache &&
    Date.now() - transactionsCache.timestamp < CACHE_DURATION
  ) {
    return transactionsCache.data;
  }
  return null;
};

/**
 * Checks if more transactions can be loaded
 *
 * @returns {boolean} True if cache is valid and has more transactions to load
 * @example
 * ```ts
 * if (canLoadMore()) {
 *   await fetchTransactions(setTransactions);
 * }
 * ```
 */
export const canLoadMore = (): boolean => {
  if (!transactionsCache) return true;
  return (
    Date.now() - transactionsCache.timestamp < CACHE_DURATION &&
    transactionsCache.data.hasNext
  );
};
