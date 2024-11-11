import { clearLeaderboardCache, hasValidCache } from "@/lib/fetch/leaderboard";
import { useDebounce } from "./useDebounce";
import { useState } from "react";
import { User } from "@/types/types";

export const useDebouncedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(!hasValidCache());

  const [leaderboardData, setLeaderboardData] = useState<
    PaginatedResponse<User[]>
  >({
    items: [],
    total: 0,
    hasNext: true,
  });
  const debouncedSearch = useDebounce((search: string) => {
    clearLeaderboardCache();
    setLoading(true);
    if (search === "") {
      setSearchTerm("");
    }
    const container = document.getElementById("container");
    if (container) container.scrollTop = 0;
    setLeaderboardData({
      items: [],
      total: 0,
      hasNext: true,
    });
  }, 300);
  return {
    debouncedSearch,
    searchTerm,
    setSearchTerm,
    loading,
    setLoading,
    leaderboardData,
    setLeaderboardData,
  };
};
