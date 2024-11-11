import { PlatformSpecificColors, SystemTheme, ThemeParams } from "../types";

export const getPlatformSpecificColors = (
  platform: string,
  colorScheme: SystemTheme,
  themeParams: ThemeParams
): PlatformSpecificColors => {
  if (colorScheme === "light") {
    return {
      tabbarBg: themeParams.bottom_bar_bg_color,
      mainBg: themeParams.bg_color,
      modalBg: themeParams.secondary_bg_color,
      tilesBg: themeParams.secondary_bg_color,
      tableBg: themeParams.section_bg_color,
      sectionSeparatorBg: themeParams.secondary_bg_color,
      searchBg: themeParams.secondary_bg_color,
    };
  }

  // Dark theme - platform specific
  switch (platform) {
    case "ios":
      return {
        tabbarBg: themeParams.bottom_bar_bg_color,
        mainBg: themeParams.secondary_bg_color,
        modalBg: themeParams.secondary_bg_color,
        tilesBg: themeParams.section_bg_color,
        tableBg: themeParams.section_bg_color,
        sectionSeparatorBg: themeParams.bg_color,
        searchBg: `${themeParams.bg_color}80`,
      };

    case "android":
      return {
        tabbarBg: themeParams.bg_color,
        mainBg: themeParams.section_bg_color,
        modalBg: themeParams.section_bg_color,
        tilesBg: themeParams.header_bg_color,
        tableBg: themeParams.header_bg_color,
        sectionSeparatorBg: themeParams.secondary_bg_color,
        searchBg: `${themeParams.secondary_bg_color}80`,
      };

    case "web":
    default:
      return {
        tabbarBg: themeParams.bottom_bar_bg_color,
        mainBg: themeParams.bg_color,
        modalBg: themeParams.bg_color,
        tilesBg: themeParams.secondary_bg_color,
        tableBg: themeParams.secondary_bg_color,
        sectionSeparatorBg: themeParams.section_separator_color,
        searchBg: `${themeParams.section_separator_color}80`,
      };
  }
};
