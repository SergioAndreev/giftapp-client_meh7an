import { useTranslation } from "react-i18next";
import { LeaderboardItemProps } from "../types/leaderboardItemProps";
import { Link } from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import GiftsIcon from "@/components/icons/tabs/Gifts";
import styles from "../styles.module.scss";
import WebApp from "@twa-dev/sdk";
export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  user,
  rank,
  isLast,
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/profile/${user.telegramId}`}
      state={{
        ...user,
        rank: user.rank !== -1 ? user.rank : undefined,
        from: "/leaderboard",
      }}
    >
      <div className={styles.leaderboardItem}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <Avatar user={user} />
          </div>
          <div className={styles.userContent}>
            <div
              className={styles.userDetails}
              style={isLast ? { border: "none" } : {}}
            >
              <p className={styles.name}>
                {user.firstName} {user.lastName}
                {user.telegramId === WebApp.initDataUnsafe.user?.id && (
                  <span>{t("leaderboard.you")}</span>
                )}
              </p>
              <div className={styles.gifts}>
                <GiftsIcon />
                {t("leaderboard.giftsCount", {
                  count: user.totalGiftsCount,
                })}
              </div>
            </div>
            {user.rank !== -1 && (
              <div className={styles.rank}>{rank(user.rank)}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
