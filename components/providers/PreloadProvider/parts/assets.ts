import constant from "@/constants";

export function useAssetProvider() {
  return [
    {
      type: "lottie" as const,
      url:
        constant.ASSETS_PREFIX +
        "/animations/gifts/9bb4660fd33a9a1f04204dafbba1b44f.json",
    },
    {
      type: "lottie" as const,
      url:
        constant.ASSETS_PREFIX +
        "/animations/gifts/4061b9dc02e33976997b5400195f096c.json",
    },
    {
      type: "lottie" as const,
      url:
        constant.ASSETS_PREFIX +
        "/animations/gifts/a25f423e2ca5a290008ea09d1fca1a5d.json",
    },
    {
      type: "lottie" as const,
      url:
        constant.ASSETS_PREFIX +
        "/animations/gifts/ebc597c75d43e7bb30d28c30a82de953.json",
    },
    {
      type: "lottie" as const,
      url:
        constant.ASSETS_PREFIX +
        "/animations/gifts/ebc597c75d43e7bb30d28c30a82de953.json",
    },
    {
      type: "lottie" as const,
      url: constant.ASSETS_PREFIX + "/animations/ui/bronze-medal.json",
    },
    {
      type: "lottie" as const,
      url: constant.ASSETS_PREFIX + "/animations/ui/silver-medal.json",
    },
    {
      type: "lottie" as const,
      url: constant.ASSETS_PREFIX + "/animations/ui/gold-medal.json",
    },
    {
      type: "lottie" as const,
      url: constant.ASSETS_PREFIX + "/animations/ui/emoji-balloons.json",
    },
    {
      type: "svg" as const,
      url:
        constant.ASSETS_PREFIX +
        "/patterns/2da562330154b75d2212a2554cd1f754.svg",
    },
  ];
}
