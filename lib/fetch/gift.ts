import { giftService } from "../services";
import { Gift } from "../../types/types";

const giftCache: Record<string, Gift> = {};

/**
 * Fetches a gift by slug, using cache if available, and updates state via callback
 *
 * @param slug - The unique slug or ID of the gift to fetch
 * @param setGift - State setter callback function to update the gift in the UI
 * @throws {Error} When gift fetch fails or returns no data
 * @example
 * ```ts
 * // Using with React state
 * const [gift, setGift] = useState<Gift | null>(null);
 * await fetchGift('holiday-special', setGift);
 * ```
 */
export const fetchGift = async (
  slug: string,
  setGift: (gift: Gift) => void
) => {
  try {
    if (giftCache[slug]) {
      setGift(giftCache[slug]);
      return;
    }

    const { error, success, data } = await giftService.getGiftById(slug);

    if (!success || !data) {
      throw new Error(error || "Failed to fetch gift");
    }

    giftCache[slug] = data;
    giftCache[data.id] = data;

    setGift(data);
  } catch (error) {
    console.error(`Failed to fetch gift ${slug}:`, error);
    throw error;
  }
};

/**
 * Removes a specific gift from the cache using either slug or ID
 *
 * @param slugOrId - The slug or ID of the gift to remove from cache
 * @example
 * ```ts
 * clearGiftCache('holiday-special'); // Clear by slug
 * clearGiftCache('gift-123'); // Clear by ID
 * ```
 */
export const clearGiftCache = (slugOrId: string) => {
  const gift = giftCache[slugOrId];
  if (gift) {
    delete giftCache[gift.slug];
    delete giftCache[gift.id];
  }
};

/**
 * Clears all gifts from the cache
 *
 * @example
 * ```ts
 * clearAllGiftCache(); // Removes all cached gifts
 * ```
 */
export const clearAllGiftCache = () => {
  Object.keys(giftCache).forEach((key) => {
    delete giftCache[key];
  });
};

/**
 * Checks if a gift exists in the cache
 *
 * @param slugOrId - The slug or ID to check in the cache
 * @returns {boolean} True if the gift is cached, false otherwise
 * @example
 * ```ts
 * if (isGiftCached('holiday-special')) {
 *   // Gift is available in cache
 * }
 * ```
 */
export const isGiftCached = (slugOrId: string): boolean => {
  return !!giftCache[slugOrId];
};

/**
 * Retrieves a gift from the cache if it exists
 *
 * @param slugOrId - The slug or ID of the gift to retrieve
 * @returns {Gift | null} The cached gift object or null if not found
 * @example
 * ```ts
 * const gift = getCachedGift('holiday-special');
 * if (gift) {
 *   // Use cached gift
 * }
 * ```
 */
export const getCachedGift = (slugOrId: string): Gift | null => {
  return giftCache[slugOrId] || null;
};
