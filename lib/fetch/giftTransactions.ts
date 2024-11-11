import { giftService } from "../services";
import { TransactionListResponse } from "../../types/types";

interface TransactionCache {
  data: TransactionListResponse;
  timestamp: number;
  limit: number;
}

interface GiftTransactionCaches {
  [giftId: string]: TransactionCache;
}

const CACHE_DURATION = 5 * 60 * 1000;
let giftTransactionCaches: GiftTransactionCaches = {};
const loadingGifts: Set<string> = new Set();

/**
 * Checks if there's a valid cache entry for the given gift ID
 *
 * @param giftId - The ID of the gift to check
 * @param limit - Optional pagination limit to validate against cached limit
 * @returns {boolean} True if cache exists, is not expired, and matches the limit
 * @example
 * ```ts
 * if (hasValidCache('gift-123', 10)) {
 *   // Use cached data
 * }
 * ```
 */
export const hasValidCache = (giftId: string, limit?: number): boolean => {
  const cache = giftTransactionCaches[giftId];
  if (!cache) {
    return false;
  }
  const isExpired = Date.now() - cache.timestamp >= CACHE_DURATION;
  const isSameLimit = limit ? cache.limit === limit : true;
  return !isExpired && isSameLimit && Boolean(cache.data.items.length);
};

/**
 * Fetches transactions for a gift, using cache if available, and updates state via callback.
 * Handles pagination and cache updates automatically.
 *
 * @param giftId - The ID of the gift to fetch transactions for
 * @param setTransactions - State setter callback function to update transactions in the UI
 * @param limit - Number of transactions per page (default: 10)
 * @throws {Error} When transaction fetch fails or returns no data
 * @example
 * ```ts
 * const [transactions, setTransactions] = useState<TransactionListResponse>({
 *   items: [], hasNext: false, total: 0
 * });
 * await fetchGiftTransactions('gift-123', setTransactions, 20);
 * ```
 */
export const fetchGiftTransactions = async (
  giftId: string,
  setTransactions: (data: TransactionListResponse) => void,
  limit: number = 10
) => {
  try {
    if (!giftTransactionCaches[giftId]) {
      if (loadingGifts.has(giftId)) {
        return;
      }
      loadingGifts.add(giftId);
      const { error, success, data } = await giftService.getGiftTransactions(
        giftId,
        1,
        limit
      );
      if (!success || !data) {
        throw new Error(error || "Failed to fetch gift transactions");
      }
      giftTransactionCaches[giftId] = {
        data,
        timestamp: Date.now(),
        limit,
      };
      loadingGifts.delete(giftId);
      setTransactions(data);
      return;
    }

    const cache = giftTransactionCaches[giftId];

    if (Date.now() - cache.timestamp >= CACHE_DURATION) {
      clearGiftTransactionsCache(giftId);
      fetchGiftTransactions(giftId, setTransactions, limit);
      return;
    }

    if (!cache.data.hasNext) {
      setTransactions(cache.data);
      return;
    }

    const nextPage = Math.floor(cache.data.items.length / limit) + 1;
    const { error, success, data } = await giftService.getGiftTransactions(
      giftId,
      nextPage,
      limit
    );
    if (!success || !data) {
      throw new Error(error || "Failed to fetch gift transactions");
    }

    giftTransactionCaches[giftId] = {
      data: {
        items: [...cache.data.items, ...data.items],
        hasNext: data.hasNext,
        total: data.total,
      },
      timestamp: cache.timestamp,
      limit,
    };
    setTransactions(giftTransactionCaches[giftId].data);
  } catch (error) {
    console.error("Failed to fetch gift transactions:", error);
    loadingGifts.delete(giftId);
    setTransactions({ items: [], hasNext: false, total: 0 });
  }
};

/**
 * Forces a refresh of transactions for a gift by clearing cache and fetching fresh data
 *
 * @param giftId - The ID of the gift to refresh transactions for
 * @param setTransactions - State setter callback function to update transactions in the UI
 * @param limit - Number of transactions per page (default: 10)
 * @example
 * ```ts
 * await refreshGiftTransactions('gift-123', setTransactions);
 * ```
 */
export const refreshGiftTransactions = async (
  giftId: string,
  setTransactions: (data: TransactionListResponse) => void,
  limit: number = 10
) => {
  loadingGifts.delete(giftId);
  clearGiftTransactionsCache(giftId);
  await fetchGiftTransactions(giftId, setTransactions, limit);
};

/**
 * Clears the transaction cache for a specific gift
 *
 * @param giftId - The ID of the gift to clear cache for
 * @example
 * ```ts
 * clearGiftTransactionsCache('gift-123');
 * ```
 */
export const clearGiftTransactionsCache = (giftId: string) => {
  delete giftTransactionCaches[giftId];
};

/**
 * Clears all cached gift transactions
 *
 * @example
 * ```ts
 * clearAllGiftTransactionCaches();
 * ```
 */
export const clearAllGiftTransactionCaches = () => {
  giftTransactionCaches = {};
};

/**
 * Retrieves cached transactions for a gift if available and not expired
 *
 * @param giftId - The ID of the gift to get cached transactions for
 * @returns {TransactionListResponse | null} Cached transactions or null if not found/expired
 * @example
 * ```ts
 * const cachedTransactions = getCachedGiftTransactions('gift-123');
 * if (cachedTransactions) {
 *   // Use cached transactions
 * }
 * ```
 */
export const getCachedGiftTransactions = (
  giftId: string
): TransactionListResponse | null => {
  const cache = giftTransactionCaches[giftId];
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }
  return null;
};

/**
 * Checks if more transactions can be loaded for a gift
 *
 * @param giftId - The ID of the gift to check
 * @returns {boolean} True if cache is valid and has more transactions to load
 * @example
 * ```ts
 * if (canLoadMore('gift-123')) {
 *   await fetchGiftTransactions('gift-123', setTransactions);
 * }
 * ```
 */
export const canLoadMore = (giftId: string): boolean => {
  const cache = giftTransactionCaches[giftId];
  if (!cache) return true;
  return Date.now() - cache.timestamp < CACHE_DURATION && cache.data.hasNext;
};
