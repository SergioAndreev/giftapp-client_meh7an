import { useEffect } from "react";
import { preloadLottieAnimations } from "../../CachedLottie/utils/preload";
import constant from "@/constants";

export const preloadIcons = async (
  subtitleTextColor: string,
  accentTextColor: string
) => {
  useEffect(() => {
    const urls = [
      constant.ASSETS_PREFIX + "/animations/tabs/tab-store.json",
      constant.ASSETS_PREFIX + "/animations/tabs/tab-gifts.json",
      constant.ASSETS_PREFIX + "/animations/tabs/tab-leaderboard.json",
      constant.ASSETS_PREFIX + "/animations/tabs/tab-profile.json",
    ];

    const colors = [subtitleTextColor, accentTextColor];

    preloadLottieAnimations(urls, colors);
  }, [subtitleTextColor, accentTextColor]);
};
