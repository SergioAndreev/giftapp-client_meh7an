import { CachedLottie } from "@/components/ui/CachedLottie";
import constant from "@/constants";

export const medals = {
  gold: (
    <CachedLottie
      styles={{ width: "2rem", height: "2rem", marginRight: "-0.5rem" }}
      loop={false}
      url={`${constant.ASSETS_PREFIX}/animations/ui/gold-medal.json`}
    />
  ),
  silver: (
    <CachedLottie
      styles={{ width: "2rem", height: "2rem", marginRight: "-0.5rem" }}
      loop={false}
      url={`${constant.ASSETS_PREFIX}/animations/ui/silver-medal.json`}
    />
  ),
  bronze: (
    <CachedLottie
      styles={{ width: "2rem", height: "2rem", marginRight: "-0.5rem" }}
      loop={false}
      url={`${constant.ASSETS_PREFIX}/animations/ui/bronze-medal.json`}
    />
  ),
};
