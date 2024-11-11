import { giftService } from "../services";
import { Gift } from "../../types/types";

let giftsCache: Gift[] | null = null;

/**
 * Fetches all gifts, using cache if available, and updates state via callback
 *
 * @param setGifts - State setter callback function to update the gifts list in the UI
 * @throws {Error} When gifts fetch fails or returns no data
 * @example
 * ```ts
 * // Using with React state
 * const [gifts, setGifts] = useState<Gift[]>([]);
 * await fetchGifts(setGifts);
 * ```
 */
export const fetchGifts = async (setGifts: (data: Gift[]) => void) => {
  try {
    if (giftsCache) {
      setGifts(giftsCache);
      return;
    }

    const { error, success, data } = await giftService.getGifts();
    if (!success) {
      throw new Error(error);
    }

    giftsCache = data.gifts;
    setGifts(giftsCache);
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
  }
};

/**
 * Clears the cached list of gifts, forcing next fetchGifts call to fetch fresh data
 *
 * @example
 * ```ts
 * clearGiftsCache(); // Removes cached gifts list
 * await fetchGifts(setGifts); // Will fetch fresh data
 * ```
 */
export const clearGiftsCache = () => {
  giftsCache = null;
};
