import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import PremiumBadge from "@/components/icons/general/PremiumBadge";
import Avatar from "@/components/ui/Avatar";
import { GiftList } from "@/components/ui/GiftList";
import TimeIcon from "@/components/icons/general/Time";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import Sun from "@/components/icons/darkMode/Sun";
import Moon from "@/components/icons/darkMode/Moon";
import { changeLanguage } from "@/i18n";
import { InfiniteScrollContainer } from "@/components/ui/InfiniteScroll/InfiniteScrollContainer";
import ShrinkingHeader from "@/components/ui/ShrinkingHeader";
import { useLoadUser } from "./hooks/useLoadUser";
import { useLoadPage } from "./hooks/useLoadPage";
import { useToggleTheme } from "./hooks/useToggleTheme";
import { getRankColor } from "./parts/getRankColor";

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [checkLoading, setCheckLoading] = useState(false);

  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { toggleTheme, mode, systemTheme, colors } = useToggleTheme();
  const { error, userData, navState } = useLoadUser();
  useLoadPage(userData, navState);

  if (error) {
    if (error.includes("404") && !userData) {
      return (
        <div className={styles.container}>
          <div className={styles.errorBox}>No user data found</div>
        </div>
      );
    }
    return <div className={styles.container}>Error: {error}</div>;
  } else if (!userData) return <></>;

  return (
    <InfiniteScrollContainer
      loading={loading}
      setLoading={setLoading}
      checkLoading={checkLoading}
      setCheckLoading={setCheckLoading}
      hasNext={hasNext}
      itemHeight={5}
      className={styles.container}
      id="container"
      currentItems={loadedCount}
      defaultItems={9}
    >
      <div className={styles.content}>
        {navState.isMe && (
          <div className={styles.topSwitches}>
            <ToggleSwitch
              options={[
                {
                  value: "system",
                  label: systemTheme === "light" ? <Sun /> : <Moon />,
                },
                {
                  value: systemTheme === "light" ? "dark" : "light",
                  label: systemTheme === "light" ? <Moon /> : <Sun />,
                },
              ]}
              value={mode}
              onChange={toggleTheme}
            />
            <ToggleSwitch
              options={[
                { value: "en", label: "EN" },
                { value: "ru", label: "RU" },
              ]}
              value={i18n.language}
              onChange={(newLang) => changeLanguage(newLang)}
            />
          </div>
        )}
        <ShrinkingHeader
          className={styles.header}
          maxShrinkPercentage={20}
          shrinkThreshold={20}
        >
          <div className={styles.profileArea}>
            <div
              className={styles.profileHeader}
              style={!navState.isMe ? { justifyContent: "center" } : {}}
            >
              <div className={styles.profileImage}>
                {userData.username ? (
                  <Avatar user={userData} size={6.25} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {userData.firstName?.slice(0, 1)}
                    {userData.lastName?.slice(0, 1) || ""}
                  </div>
                )}
                {userData.rank && (
                  <span
                    className={styles.rank}
                    style={{
                      backgroundColor:
                        getRankColor(userData.rank) || colors.button,
                    }}
                  >
                    #{userData.rank}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>
                <h1>{userData.firstName}</h1>
                {userData.isPremium && <PremiumBadge />}
              </div>
              <p>
                {t("profile.giftsReceived", {
                  count: userData.totalGiftsCount,
                })}
              </p>
              {navState.isMe && (
                <Link to="/recent">
                  <div className={styles.recentActions}>
                    <TimeIcon /> {t("profile.recentActions")}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </ShrinkingHeader>
        <GiftList
          isPending={false}
          telegramId={userData.telegramId || 0}
          length={userData.totalGiftsCount}
          infiniteScrollLoader={{
            isLoading: loading,
            setIsLoading: setLoading,
            setCheckLoading: setCheckLoading,
            setHasNext: setHasNext,
            setLoadedCount: setLoadedCount,
          }}
        />
      </div>
    </InfiniteScrollContainer>
  );
};

export default Profile;
