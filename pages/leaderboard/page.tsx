import { User } from "@/types/types";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { fetchMe } from "@/lib/fetch/user";
import { useTranslation } from "react-i18next";
import { InfiniteScrollContainer } from "@/components/ui/InfiniteScroll/InfiniteScrollContainer";
import { AnimatedItem } from "@/components/ui/InfiniteScroll/AnimatedItem";
import { LoadingPlaceholder } from "@/components/ui/InfiniteScroll/LoadingPlaceholder";
import SearchIcon from "@/components/icons/general/Search";
import { medals } from "./parts/medals";
import { LoadingItem } from "./tsx/LoadingItem";
import { useDebouncedSearch } from "./hooks/useDebouncedSearch";
import { LeaderboardItem } from "./tsx/LeaderboardItem";
import { useUpdateLeaderboard } from "./hooks/useUpdateLeaderboard";
import { useLoadPage } from "./hooks/useLoadPage";

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const [me, setMe] = useState<User | null>(null);
  const {
    debouncedSearch,
    searchTerm,
    setSearchTerm,
    loading,
    setLoading,
    leaderboardData,
    setLeaderboardData,
  } = useDebouncedSearch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    fetchMe(setMe);
  }, []);

  const { checkLoading, setCheckLoading } = useUpdateLeaderboard({
    searchTerm,
    loading,
    setLoading,
    leaderboardData,
    setLeaderboardData,
  });

  useLoadPage();

  const rank = (index?: number) => {
    if (index === 1) return medals.gold;
    if (index === 2) return medals.silver;
    if (index === 3) return medals.bronze;
    return <span>{"#" + index}</span>;
  };

  return (
    <InfiniteScrollContainer
      loading={loading}
      setLoading={setLoading}
      checkLoading={checkLoading}
      setCheckLoading={setCheckLoading}
      hasNext={leaderboardData.hasNext}
      itemHeight={3.4375}
      className={styles.container}
      id="container"
      currentItems={leaderboardData.items.length}
    >
      <div className={styles.search}>
        <input
          type="text"
          placeholder={t("leaderboard.search")}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className={styles.inputPlaceholder}>
          <SearchIcon /> <p>{t("leaderboard.search")}</p>
        </div>
        <div
          className={styles.cancel}
          onClick={() => {
            (document.activeElement as HTMLElement)?.blur();
            if (searchTerm.length > 0) {
              debouncedSearch("");
            }
          }}
        >
          {t("leaderboard.cancel")}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.leaderboardList}>
          {leaderboardData.items.map((user, index) => (
            <AnimatedItem
              key={user.telegramId}
              index={index}
              totalItems={leaderboardData.items.length}
            >
              <LeaderboardItem
                user={
                  { ...user, rank: searchTerm === "" ? user?.rank : -1 } as User
                }
                rank={rank}
                isLast={index === leaderboardData.items.length - 1}
              />
            </AnimatedItem>
          ))}

          {leaderboardData.hasNext && (
            <LoadingPlaceholder count={10} className={styles.loadingArea}>
              <LoadingItem />
            </LoadingPlaceholder>
          )}
        </div>

        {me && (
          <div className={styles.you}>
            <LeaderboardItem user={me} rank={rank} />
          </div>
        )}
      </div>
    </InfiniteScrollContainer>
  );
};

export default Leaderboard;
