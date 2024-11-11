import {
  fetchLeaderboard,
  getCachedLeaderboard,
  LeaderboardData,
} from "@/lib/fetch/leaderboard";
import { User } from "@/types/types";
import { SetStateAction, useEffect, useState } from "react";

export const useUpdateLeaderboard = ({
  searchTerm,
  loading,
  setLoading,
  leaderboardData,
  setLeaderboardData,
}: {
  searchTerm: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  leaderboardData: PaginatedResponse<User[]>;
  setLeaderboardData: (
    value: SetStateAction<PaginatedResponse<User[]>>
  ) => void;
}) => {
  const [checkLoading, setCheckLoading] = useState(false);
  useEffect(() => {
    const updateLeaderboard = (data: LeaderboardData) => {
      setLeaderboardData({
        items: data.users,
        total: data.total,
        hasNext: data.hasNext,
      });
      if (loading) {
        setLoading(false);
        setCheckLoading(false);
      }
    };

    if (!loading || !leaderboardData.hasNext) {
      const cachedData = getCachedLeaderboard(searchTerm);
      if (cachedData) updateLeaderboard(cachedData);
      return;
    }

    fetchLeaderboard(updateLeaderboard, 10, searchTerm);
  }, [loading, searchTerm]);

  return { checkLoading, setCheckLoading };
};
