import { useRoutePath } from "@/components/providers/RoutesProvider";
import { useEffect, useState } from "react";

export const useTabBarVisible = () => {
  const [isVisible, setIsVisible] = useState(true);
  const currentPath = useRoutePath();

  useEffect(() => {
    setIsVisible(
      ["store", "gifts", "leaderboard"].includes(
        currentPath.replace("/", "")
      ) || currentPath.startsWith("profile")
    );
  }, [currentPath]);

  return isVisible;
};
