import WebApp from "@twa-dev/sdk";
import { darkColors, lightColors } from "../presets";
import { getPlatformSpecificColors } from "./platformSpecific";
import {
  PlatformSpecificColors,
  SystemTheme,
  ThemeColors,
  ThemeMode,
} from "../types";

export const getCurrentColors = (
  mode: ThemeMode
): ThemeColors & PlatformSpecificColors => {
  const systemTheme = WebApp.colorScheme as SystemTheme;
  if (mode === "system") {
    const baseColors = {
      hint: WebApp.themeParams.hint_color,
      headerBg: WebApp.themeParams.header_bg_color,
      secondaryBg: WebApp.themeParams.secondary_bg_color,
      bottomBarBg:
        WebApp.themeParams.bottom_bar_bg_color || WebApp.themeParams.bg_color,
      text: WebApp.themeParams.text_color,
      separator: WebApp.themeParams.section_separator_color,
      buttonText: WebApp.themeParams.button_text_color,
      link: WebApp.themeParams.link_color,
      accent: WebApp.themeParams.accent_text_color,
      sectionBg: WebApp.themeParams.section_bg_color,
      destructive: WebApp.themeParams.destructive_text_color,
      bg: WebApp.themeParams.bg_color,
      button: WebApp.themeParams.button_color,
      subtitle: WebApp.themeParams.subtitle_text_color,
      sectionHeader: WebApp.themeParams.section_header_text_color,
    };

    const platformColors = getPlatformSpecificColors(
      WebApp.platform,
      systemTheme,
      WebApp.themeParams
    );

    return {
      ...baseColors,
      ...platformColors,
    };
  }
  return mode === "light" ? lightColors : darkColors;
};
