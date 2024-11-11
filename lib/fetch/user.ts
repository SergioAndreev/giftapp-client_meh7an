import { userService } from "../services";
import { User } from "../../types/types";
import WebApp from "@twa-dev/sdk";

const userCache: Record<number, User> = {};

/**
 * Fetches a user by Telegram ID, using cache if available, and updates state via callback
 *
 * @param telegramId - The Telegram user ID to fetch
 * @param setUser - State setter callback function to update the user in the UI
 * @throws {Error} When user fetch fails, returns no data, or when the service call fails
 * @example
 * ```ts
 * const [user, setUser] = useState<User | null>(null);
 * try {
 *   await fetchUser(123456789, setUser);
 * } catch (error) {
 *   console.error('Failed to load user:', error);
 * }
 * ```
 */
export const fetchUser = async (
  telegramId: number,
  setUser: (user: User) => void
) => {
  try {
    if (userCache[telegramId]) {
      setUser(userCache[telegramId]);
      return;
    }

    const { error, success, data } = await userService.getUser(telegramId);

    if (!success) {
      throw new Error(error);
    }

    if (!data) {
      throw new Error("Failed to fetch user");
    }

    userCache[telegramId] = data;
    setUser(data);
  } catch (error) {
    console.error(`Failed to fetch user ${telegramId}:`, error);
    throw error;
  }
};

/**
 * Fetches the current user's data from Telegram WebApp and updates state via callback
 *
 * @param setUser - State setter callback function to update the user in the UI
 * @throws {Error} When user ID is not found in WebApp initData or when fetch fails
 * @example
 * ```ts
 * const [currentUser, setCurrentUser] = useState<User | null>(null);
 * try {
 *   await fetchMe(setCurrentUser);
 * } catch (error) {
 *   console.error('Failed to load current user:', error);
 * }
 * ```
 */
export const fetchMe = async (setUser: (user: User) => void) => {
  try {
    const initData = WebApp.initDataUnsafe;

    if (!initData.user?.id) {
      throw new Error("User ID not found in WebApp initData");
    }

    await fetchUser(initData.user.id, setUser);
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

/**
 * Removes a specific user from the cache
 *
 * @param telegramId - The Telegram user ID to remove from cache
 * @example
 * ```ts
 * clearUserCache(123456789);
 * ```
 */
export const clearUserCache = (telegramId: number) => {
  delete userCache[telegramId];
};

/**
 * Clears all users from the cache
 *
 * @example
 * ```ts
 * clearAllUserCache();
 * ```
 */
export const clearAllUserCache = () => {
  Object.keys(userCache).forEach((key) => {
    delete userCache[Number(key)];
  });
};

/**
 * Checks if a user exists in the cache
 *
 * @param telegramId - The Telegram user ID to check
 * @returns {boolean} True if the user is cached, false otherwise
 * @example
 * ```ts
 * if (isUserCached(123456789)) {
 *   // User data is available in cache
 * }
 * ```
 */
export const isUserCached = (telegramId: number): boolean => {
  return !!userCache[telegramId];
};
