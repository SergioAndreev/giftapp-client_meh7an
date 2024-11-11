import { PlatformSpecificColors, ThemeColors } from "./types";

export const darkColors: ThemeColors & PlatformSpecificColors = {
  // iOS dark theme colors
  hint: "#98989e",
  headerBg: "#1a1a1a",
  secondaryBg: "#1c1c1d",
  bottomBarBg: "#1d1d1d",
  text: "#ffffff",
  separator: "#545458",
  buttonText: "#ffffff",
  link: "#1a71ed",
  accent: "#1a71ed",
  sectionBg: "#2c2c2e",
  destructive: "#eb5545",
  bg: "#000000",
  button: "#1a71ed",
  subtitle: "#98989e",
  sectionHeader: "#8d8e93",

  // iOS-pattern specific colors
  tabbarBg: "#1d1d1d", // bottom_bar_bg_color
  mainBg: "#1c1c1d", // secondary_bg_color
  modalBg: "#1c1c1d", // secondary_bg_color
  tilesBg: "#2c2c2e", // section_bg_color
  tableBg: "#2c2c2e", // section_bg_color
  sectionSeparatorBg: "#000000", // bg_color
  searchBg: "#00000080", // bg_color + 50% opacity
};

export const lightColors: ThemeColors & PlatformSpecificColors = {
  // iOS light theme colors
  hint: "#8e8e93",
  headerBg: "#f8f8f8",
  secondaryBg: "#efeff4",
  bottomBarBg: "#f2f2f2",
  text: "#000000",
  separator: "#c8c7cc",
  buttonText: "#ffffff",
  link: "#007aff",
  accent: "#007aff",
  sectionBg: "#ffffff",
  destructive: "#ff3b30",
  bg: "#ffffff",
  button: "#007aff",
  subtitle: "#8e8e93",
  sectionHeader: "#6d6d72",

  // iOS-pattern specific colors
  tabbarBg: "#f2f2f2", // bottom_bar_bg_color
  mainBg: "#ffffff", // bg_color
  modalBg: "#efeff4", // secondary_bg_color
  tilesBg: "#efeff4", // secondary_bg_color
  tableBg: "#ffffff", // section_bg_color
  sectionSeparatorBg: "#efeff4", // secondary_bg_color
  searchBg: "#efeff4", // secondary_bg_color
};
