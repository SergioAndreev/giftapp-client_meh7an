import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export const useTabConfigs = () => {
  const { t, ready } = useTranslation();

  return useMemo(() => {
    if (!ready) {
      return [];
    }

    return [
      { label: t("tabs.store"), route: "store" },
      { label: t("tabs.gifts"), route: "gifts" },
      { label: t("tabs.leaderboard"), route: "leaderboard" },
      { label: t("tabs.profile"), route: "profile" },
    ];
  }, [t, ready]);
};
