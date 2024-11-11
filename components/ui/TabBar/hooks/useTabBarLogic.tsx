import { useEffect } from "react";
import { preloadLottieAnimations } from "../../CachedLottie/utils/preload";
import { useTheme } from "@/components/providers/ThemeProvider";
import { CachedLottie } from "../../CachedLottie";
import { useTabBarVisible } from "./useTabBarVisible";
import WebApp from "@twa-dev/sdk";
import constant from "@/constants";

export const tabConfigs = [
  { label: "Store", route: "store" },
  { label: "Gifts", route: "gifts" },
  { label: "Leaderboard", route: "leaderboard" },
  { label: "Profile", route: "profile" },
];

export const useTabBarLogic = (
  currentPath: string,
  previousPath: string,
  tabConfigs: { label: string; route: string }[]
) => {
  const { colors } = useTheme();

  // Preload all tab icons with both active and inactive colors
  useEffect(() => {
    const urls = tabConfigs.map(
      (tab) => `${constant.ASSETS_PREFIX}/animations/tabs/tab-${tab.route}.json`
    );

    preloadLottieAnimations(urls, [colors.subtitle, colors.accent]);
  }, [colors.subtitle, colors.accent]);

  const tabsData = tabConfigs.map(({ label, route }) => ({
    icon: () => (
      <CachedLottie
        url={`${constant.ASSETS_PREFIX}/animations/tabs/tab-${route}.json`}
        styles={{ width: "1.7rem", height: "1.7rem" }}
        loop={false}
        excludeFromController={true}
        play={
          isTabActive(route, currentPath) && !isTabActive(route, previousPath)
        }
        color={
          isTabActive(route, currentPath) ? colors.accent : colors.subtitle
        }
      />
    ),
    label,
    route,
  }));

  const isVisible = useTabBarVisible();

  return {
    tabsData,
    isVisible,
  };
};

// Helper function to check if a tab is active
const isTabActive = (route: string, currentPath: string = "") => {
  const routeArr = currentPath.split("/");
  if (routeArr.length > 1) {
    if (routeArr[0] === "profile") {
      const userId = parseInt(routeArr[1]);
      if (userId === WebApp.initDataUnsafe?.user?.id) {
        return route === "profile";
      }
      return route === "leaderboard";
    }
  }
  return route === currentPath.replace("/", "");
};
