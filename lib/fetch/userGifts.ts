import { userService } from "../services";
import { Transaction } from "../../types/types";

interface PaginatedGiftCache {
  data: PaginatedResponse<Transaction[]>;
  timestamp: number;
  limit: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const giftsCache = new Map<string, PaginatedGiftCache>();
let isInitialLoadInProgress = false;

const createCacheKey = (isPending: boolean, telegramId?: number): string => {
  return `${isPending}-${telegramId || "self"}`;
};

/**
 * Checks if there's a valid cache entry for the given parameters
 *
 * @param isPending - Whether to check pending or completed gifts cache
 * @param telegramId - Optional Telegram user ID to check cache for
 * @param limit - Optional pagination limit to validate against cached limit
 * @returns {boolean} True if cache exists, is not expired, and matches parameters
 * @example
 * ```ts
 * if (hasValidGiftCache(true, 123456789, 10)) {
 *   // Use cached pending gifts
 * }
 * ```
 */
export const hasValidGiftCache = (
  isPending: boolean,
  telegramId?: number,
  limit?: number
): boolean => {
  const cacheKey = createCacheKey(isPending, telegramId);
  const cachedData = giftsCache.get(cacheKey);

  if (!cachedData) return false;

  const isExpired = Date.now() - cachedData.timestamp >= CACHE_DURATION;
  const isSameLimit = limit ? cachedData.limit === limit : true;
  return !isExpired && isSameLimit && Boolean(cachedData.data.items.length);
};

/**
 * Fetches a user's gifts, using cache if available, and updates state via callback.
 * Handles pagination and cache updates automatically.
 *
 * @param setGifts - State setter callback function to update gifts in the UI
 * @param isPending - Whether to fetch pending or completed gifts
 * @param telegramId - Optional Telegram user ID (defaults to current user if not provided)
 * @param limit - Number of gifts per page (default: 9)
 * @throws {Error} When gifts fetch fails or returns no data
 * @example
 * ```ts
 * const [gifts, setGifts] = useState<PaginatedResponse<Transaction[]>>({
 *   items: [], hasNext: false, total: 0
 * });
 * await fetchUserGifts(setGifts, false, 123456789, 10);
 * ```
 */
export const fetchUserGifts = async (
  setGifts: (data: PaginatedResponse<Transaction[]>) => void,
  isPending: boolean,
  telegramId?: number,
  limit: number = 9
) => {
  try {
    const cacheKey = createCacheKey(isPending, telegramId);
    const cachedData = giftsCache.get(cacheKey);

    // Handle initial load
    if (!cachedData) {
      if (isInitialLoadInProgress) return;

      isInitialLoadInProgress = true;
      const { error, success, data } = await userService.getUserGifts(
        isPending,
        telegramId,
        1,
        limit
      );

      if (!success || !data) {
        throw new Error(error || "Failed to fetch gifts");
      }

      giftsCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        limit,
      });

      isInitialLoadInProgress = false;
      setGifts(data);
      return;
    }

    if (Date.now() - cachedData.timestamp >= CACHE_DURATION) {
      clearGiftsCacheForUser(isPending, telegramId);
      fetchUserGifts(setGifts, isPending, telegramId, limit);
      return;
    }

    if (!cachedData.data.hasNext) {
      setGifts(cachedData.data);
      return;
    }

    const nextPage = Math.floor(cachedData.data.items.length / limit) + 1;
    const { error, success, data } = await userService.getUserGifts(
      isPending,
      telegramId,
      nextPage,
      limit
    );

    if (!success || !data) {
      throw new Error(error || "Failed to fetch gifts");
    }

    giftsCache.set(cacheKey, {
      data: {
        items: [...cachedData.data.items, ...data.items],
        hasNext: data.hasNext,
        total: data.total,
      },
      timestamp: cachedData.timestamp,
      limit,
    });

    setGifts(giftsCache.get(cacheKey)!.data);
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
    isInitialLoadInProgress = false;
    setGifts({ items: [], hasNext: false, total: 0 });
  }
};

/**
 * Forces a refresh of user's gifts by clearing cache and fetching fresh data
 *
 * @param setGifts - State setter callback function to update gifts in the UI
 * @param isPending - Whether to refresh pending or completed gifts
 * @param telegramId - Optional Telegram user ID (defaults to current user if not provided)
 * @param limit - Number of gifts per page (default: 10)
 * @example
 * ```ts
 * await refreshUserGifts(setGifts, true); // Refresh pending gifts for current user
 * ```
 */
export const refreshUserGifts = async (
  setGifts: (data: PaginatedResponse<Transaction[]>) => void,
  isPending: boolean,
  telegramId?: number,
  limit: number = 10
) => {
  isInitialLoadInProgress = false;
  clearGiftsCacheForUser(isPending, telegramId);
  await fetchUserGifts(setGifts, isPending, telegramId, limit);
};

/**
 * Clears the gifts cache for a specific user and pending status
 *
 * @param isPending - Whether to clear pending or completed gifts cache
 * @param telegramId - Optional Telegram user ID (defaults to current user if not provided)
 * @example
 * ```ts
 * clearGiftsCacheForUser(false, 123456789); // Clear completed gifts cache
 * ```
 */
export const clearGiftsCacheForUser = (
  isPending: boolean,
  telegramId?: number
) => {
  const cacheKey = createCacheKey(isPending, telegramId);
  giftsCache.delete(cacheKey);
};

/**
 * Clears all cached gifts for all users
 *
 * @example
 * ```ts
 * clearAllGiftsCache();
 * ```
 */
export const clearAllGiftsCache = () => {
  giftsCache.clear();
};

/**
 * Retrieves cached gifts if available and not expired
 *
 * @param isPending - Whether to get pending or completed gifts
 * @param telegramId - Optional Telegram user ID (defaults to current user if not provided)
 * @returns {PaginatedResponse<Transaction[]> | null} Cached gifts or null if not found/expired
 * @example
 * ```ts
 * const cachedGifts = getCachedGifts(true);
 * if (cachedGifts) {
 *   // Use cached pending gifts
 * }
 * ```
 */
export const getCachedGifts = (
  isPending: boolean,
  telegramId?: number
): PaginatedResponse<Transaction[]> | null => {
  const cacheKey = createCacheKey(isPending, telegramId);
  const cachedData = giftsCache.get(cacheKey);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  return null;
};

/**
 * Checks if more gifts can be loaded for the given parameters
 *
 * @param isPending - Whether to check pending or completed gifts
 * @param telegramId - Optional Telegram user ID (defaults to current user if not provided)
 * @returns {boolean} True if cache is valid and has more gifts to load
 * @example
 * ```ts
 * if (canLoadMoreGifts(false)) {
 *   await fetchUserGifts(setGifts, false); // Load more completed gifts
 * }
 * ```
 */
export const canLoadMoreGifts = (
  isPending: boolean,
  telegramId?: number
): boolean => {
  const cacheKey = createCacheKey(isPending, telegramId);
  const cachedData = giftsCache.get(cacheKey);

  if (!cachedData) return true;

  return (
    Date.now() - cachedData.timestamp < CACHE_DURATION &&
    cachedData.data.hasNext
  );
};
