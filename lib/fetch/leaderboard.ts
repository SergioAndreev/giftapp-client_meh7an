import { leaderboardService } from "../services";
import { User } from "../../types/types";

export interface LeaderboardData {
  users: User[];
  hasNext: boolean;
  total: number;
}

interface LeaderboardCache {
  data: LeaderboardData;
  timestamp: number;
  limit: number;
  search?: string;
}

const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Checks if there's a valid cache entry for the given parameters
 *
 * @param limit - Optional pagination limit to validate against cached limit
 * @param search - Optional search term to validate against cached search
 * @returns {boolean} True if cache exists, is not expired, and matches the parameters
 * @example
 * ```ts
 * if (hasValidCache(10, 'john')) {
 *   // Use cached data
 * }
 * ```
 */
export const hasValidCache = (limit?: number, search?: string): boolean => {
  if (!leaderboardCache) {
    return false;
  }
  const isExpired = Date.now() - leaderboardCache.timestamp >= CACHE_DURATION;
  const isSameLimit = limit ? leaderboardCache.limit === limit : true;
  const isSameSearch = search === leaderboardCache.search;
  return (
    !isExpired &&
    isSameLimit &&
    isSameSearch &&
    Boolean(leaderboardCache.data.users.length)
  );
};

let leaderboardCache: LeaderboardCache | null = null;
let isInitialLoadInProgress = false;

/**
 * Fetches leaderboard data, using cache if available, and updates state via callback.
 * Handles pagination, search, and cache updates automatically.
 *
 * @param setLeaderboard - State setter callback function to update leaderboard in the UI
 * @param limit - Number of users per page (default: 10)
 * @param search - Optional search term to filter users
 * @throws {Error} When leaderboard fetch fails or returns no data
 * @example
 * ```ts
 * const [leaderboard, setLeaderboard] = useState<LeaderboardData>({
 *   users: [], hasNext: false, total: 0
 * });
 * await fetchLeaderboard(setLeaderboard, 20, 'john');
 * ```
 */
export const fetchLeaderboard = async (
  setLeaderboard: (data: LeaderboardData) => void,
  limit: number = 10,
  search?: string
) => {
  try {
    if (leaderboardCache && search !== leaderboardCache.search) {
      clearLeaderboardCache();
    }

    if (!leaderboardCache) {
      if (isInitialLoadInProgress) {
        return;
      }
      isInitialLoadInProgress = true;
      const { error, success, data } = await leaderboardService.getLeaderboard(
        1,
        limit,
        search
      );
      if (!success || !data) {
        throw new Error(error || "Failed to fetch leaderboard");
      }
      leaderboardCache = {
        data,
        timestamp: Date.now(),
        limit,
        search,
      };
      isInitialLoadInProgress = false;
      setLeaderboard(data);
      return;
    }

    if (Date.now() - leaderboardCache.timestamp >= CACHE_DURATION) {
      clearLeaderboardCache();
      fetchLeaderboard(setLeaderboard, limit, search);
      return;
    }

    if (!leaderboardCache.data.hasNext) {
      setLeaderboard(leaderboardCache.data);
      return;
    }

    const nextPage = Math.floor(leaderboardCache.data.users.length / limit) + 1;
    const { error, success, data } = await leaderboardService.getLeaderboard(
      nextPage,
      limit,
      search
    );

    if (!success || !data) {
      throw new Error(error || "Failed to fetch leaderboard");
    }

    leaderboardCache = {
      data: {
        users: [...leaderboardCache.data.users, ...data.users],
        hasNext: data.hasNext,
        total: data.total,
      },
      timestamp: leaderboardCache.timestamp,
      limit,
      search,
    };
    setLeaderboard(leaderboardCache.data);
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    isInitialLoadInProgress = false;
    setLeaderboard({ users: [], hasNext: false, total: 0 });
  }
};

/**
 * Forces a refresh of leaderboard data by clearing cache and fetching fresh data
 *
 * @param setLeaderboard - State setter callback function to update leaderboard in the UI
 * @param limit - Number of users per page (default: 10)
 * @param search - Optional search term to filter users
 * @example
 * ```ts
 * await refreshLeaderboard(setLeaderboard, 10, 'john');
 * ```
 */
export const refreshLeaderboard = async (
  setLeaderboard: (data: LeaderboardData) => void,
  limit: number = 10,
  search?: string
) => {
  isInitialLoadInProgress = false;
  clearLeaderboardCache();
  await fetchLeaderboard(setLeaderboard, limit, search);
};

/**
 * Clears the leaderboard cache
 *
 * @example
 * ```ts
 * clearLeaderboardCache();
 * ```
 */
export const clearLeaderboardCache = () => {
  leaderboardCache = null;
};

/**
 * Retrieves cached leaderboard data if available and not expired
 *
 * @param search - Optional search term to match against cached search
 * @returns {LeaderboardData | null} Cached leaderboard or null if not found/expired
 * @example
 * ```ts
 * const cachedData = getCachedLeaderboard('john');
 * if (cachedData) {
 *   // Use cached leaderboard
 * }
 * ```
 */
export const getCachedLeaderboard = (
  search?: string
): LeaderboardData | null => {
  if (
    leaderboardCache &&
    Date.now() - leaderboardCache.timestamp < CACHE_DURATION &&
    search === leaderboardCache.search
  ) {
    return leaderboardCache.data;
  }
  return null;
};

/**
 * Checks if more leaderboard data can be loaded
 *
 * @param search - Optional search term to match against cached search
 * @returns {boolean} True if cache is valid and has more data to load, or if cache needs refresh
 * @example
 * ```ts
 * if (canLoadMore('john')) {
 *   await fetchLeaderboard(setLeaderboard, 10, 'john');
 * }
 * ```
 */
export const canLoadMore = (search?: string): boolean => {
  if (!leaderboardCache) return true;
  if (search !== leaderboardCache.search) return true;
  return (
    Date.now() - leaderboardCache.timestamp < CACHE_DURATION &&
    leaderboardCache.data.hasNext
  );
};
