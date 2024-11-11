export interface CacheEntry {
  timestamp: number;
  data: Transaction[];
}

import { transactionService } from "../services";
import { Transaction } from "../../types/types";

const CACHE_DURATION = 5 * 60 * 1000;

const transactionsCache = new Map<string, CacheEntry>();

const createCacheKey = (giftSlug: string): string => {
  return `${giftSlug}`;
};

const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_DURATION;
};

/**
 * Fetches transactions for a gift, using cache if available, and updates state via callback
 *
 * @param giftSlug - The slug identifier of the gift to fetch transactions for
 * @param setTransactions - React state setter function to update transactions in the UI
 * @throws {Error} When transaction fetch fails
 * @example
 * ```ts
 * const [transactions, setTransactions] = useState<Transaction[]>([]);
 * await fetchTransactions('holiday-special', setTransactions);
 * ```
 */
export const fetchTransactions = async (
  giftSlug: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  try {
    const cacheKey = createCacheKey(giftSlug);
    const cachedEntry = transactionsCache.get(cacheKey);

    if (cachedEntry && isCacheValid(cachedEntry)) {
      setTransactions(cachedEntry.data);
      return;
    }

    const { error, success, data } =
      await transactionService.getTransactionsOfGift(giftSlug);

    if (!success) {
      throw new Error(error);
    }

    const newCacheEntry: CacheEntry = {
      timestamp: Date.now(),
      data: data.transactions,
    };
    transactionsCache.set(cacheKey, newCacheEntry);

    setTransactions(data.transactions);
  } catch (error) {
    console.error(`Failed to fetch transactions for gift ${giftSlug}:`, error);
  }
};

/**
 * Clears the transaction cache for a specific gift
 *
 * @param giftSlug - The slug identifier of the gift to clear cache for
 * @example
 * ```ts
 * clearTransactionCache('holiday-special');
 * ```
 */
export const clearTransactionCache = (giftSlug: string) => {
  const cacheKey = createCacheKey(giftSlug);
  transactionsCache.delete(cacheKey);
};

/**
 * Clears all cached transactions for all gifts
 *
 * @example
 * ```ts
 * clearAllTransactionCache();
 * ```
 */
export const clearAllTransactionCache = () => {
  transactionsCache.clear();
};

/**
 * Returns statistics about the current cache state
 *
 * @returns {Object} Object containing cache size and list of cached keys
 * @example
 * ```ts
 * const stats = getCacheStats();
 * console.log(`Cache has ${stats.size} entries`);
 * console.log('Cached gifts:', stats.keys);
 * ```
 */
export const getCacheStats = (): object => {
  return {
    size: transactionsCache.size,
    keys: Array.from(transactionsCache.keys()),
  };
};
