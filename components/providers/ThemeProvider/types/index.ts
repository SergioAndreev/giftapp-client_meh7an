export interface ThemeColors {
  hint: string;
  headerBg: string;
  secondaryBg: string;
  bottomBarBg: string;
  text: string;
  separator: string;
  buttonText: string;
  link: string;
  accent: string;
  sectionBg: string;
  destructive: string;
  bg: string;
  button: string;
  subtitle: string;
  sectionHeader: string;
}

export interface PlatformSpecificColors {
  tabbarBg: string;
  mainBg: string;
  modalBg: string;
  tilesBg: string;
  tableBg: string;
  sectionSeparatorBg: string;
  searchBg: string;
}

export interface ThemeParams {
  bottom_bar_bg_color: string;
  bg_color: string;
  secondary_bg_color: string;
  section_bg_color: string;
  header_bg_color: string;
  section_separator_color: string;
}

export type SystemTheme = "light" | "dark";
export type ThemeMode = "system" | SystemTheme;

export interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors & PlatformSpecificColors;
  systemTheme: SystemTheme;
  isLoading: boolean;
}
