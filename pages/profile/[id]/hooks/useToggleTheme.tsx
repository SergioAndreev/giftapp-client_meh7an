import { useTheme } from "@/components/providers/ThemeProvider";

export const useToggleTheme = () => {
  const { mode, setMode, systemTheme, colors } = useTheme();
  const toggleTheme = () => {
    if (mode === "system") {
      setMode(systemTheme === "light" ? "dark" : "light");
    } else {
      setMode("system");
    }
  };
  return { toggleTheme, mode, systemTheme, colors };
};
