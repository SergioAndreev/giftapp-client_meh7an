import React, { createContext, useContext, useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { darkColors, lightColors } from "./presets";
import {
  PlatformSpecificColors,
  SystemTheme,
  ThemeColors,
  ThemeContextType,
  ThemeMode,
} from "./types";
import { getCurrentColors } from "./parts/currentColors";

const THEME_KEY = "theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Advanced theming system for Telegram Mini Apps that handles:
 * - System/light/dark theme modes
 * - Platform-specific colors (iOS/Android/Web)
 * - CSS variable generation
 * - Telegram theme param integration
 * - Cloud storage persistence
 * - Real-time theme updates
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Using theme anywhere in the app:
 * function MyComponent() {
 *   const { colors, mode, setMode } = useTheme();
 *   return (
 *     <div style={{ color: colors.text }}>
 *       Current theme: {mode}
 *     </div>
 *   );
 * }
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // first check for WebApp. if error, return light theme
  let systemTheme: SystemTheme = "light";
  try {
    systemTheme = WebApp.colorScheme as SystemTheme;
  } catch (error) {
    console.error("Failed to get system theme:", error);
    return (
      <ThemeContext.Provider
        value={{
          mode: "light",
          setMode: () => {},
          colors: lightColors,
          systemTheme: "light",
          isLoading: false,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }
  const [mode, setMode] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState<ThemeColors & PlatformSpecificColors>(
    systemTheme === "dark" ? darkColors : lightColors
  );

  const updateThemeColors = () => {
    const newColors = getCurrentColors(mode);
    setColors(newColors);

    WebApp.setHeaderColor(`#${newColors.mainBg.replace("#", "")}`);
    WebApp.setBottomBarColor(`#${newColors.bottomBarBg.replace("#", "")}`);
    WebApp.setBackgroundColor(`#${newColors.mainBg.replace("#", "")}`);

    const root = document.documentElement;

    // Set all colors including platform-specific ones
    Object.entries(newColors).forEach(([key, value]) => {
      const cssKey = `--theme-${key.replace(
        /[A-Z]/g,
        (m) => `-${m.toLowerCase()}`
      )}`;
      root.style.setProperty(cssKey, value);

      if (!value.includes("rgba")) {
        const rgb: string | undefined = value
          .match(/\w\w/g)
          ?.map((x: string): number => parseInt(x, 16))
          .join(", ");
        if (rgb) {
          root.style.setProperty(`${cssKey}-rgb`, rgb);
        }
      }
    });

    const body = document.getElementsByTagName("body")[0];
    if ((mode === "system" && systemTheme === "dark") || mode === "dark") {
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      body.classList.add("light");
      body.classList.remove("dark");
    }
  };

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    WebApp.CloudStorage.setItem(THEME_KEY, newMode);
    updateThemeColors();
  };

  useEffect(() => {
    WebApp.CloudStorage.getItem(THEME_KEY, (error, value) => {
      if (!error && value) {
        setMode(value as ThemeMode);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    WebApp.onEvent("themeChanged", updateThemeColors);
    return () => {
      WebApp.offEvent("themeChanged", updateThemeColors);
    };
  }, [mode, systemTheme]);

  useEffect(() => {
    if (isLoading) return;
    updateThemeColors();
  }, [mode, isLoading]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode: handleSetMode,
        colors,
        systemTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme settings and colors
 * @returns {ThemeContextType} Theme controls and current color values
 *
 * @example
 * const { colors, mode, setMode } = useTheme();
 * // Use CSS variables in styled-components
 * const StyledDiv = styled.div`
 *   background: var(--theme-main-bg);
 *   color: var(--theme-text);
 * `;
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
