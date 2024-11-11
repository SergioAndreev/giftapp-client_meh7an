import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

/**
 * Custom hook for initializing and managing Telegram Web App platform integration
 *
 * This hook handles:
 * - Expanding the Web App to full height
 * - Adding platform-specific CSS classes to body
 * - Cleaning up platform classes on unmount
 *
 * @returns boolean indicating if the Telegram platform is ready
 *
 * @example
 * function App() {
 *   const isReady = useTelegramPlatform();
 *
 *   if (!isReady) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return <YourApp />;
 * }
 */
const useTelegramPlatform = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const root = document.getElementsByTagName("body")[0];
    if (!root || !WebApp) return;

    try {
      WebApp.expand();
    } catch (error) {
      console.error("Failed to expand WebApp:", error);
      setIsReady(false);
      return;
    }

    if (WebApp.platform) {
      root.classList.add(WebApp.platform);
    }

    setIsReady(true);

    return () => {
      if (WebApp.platform) {
        root.classList.remove(WebApp.platform);
      }
    };
  }, []);

  return isReady;
};

export default useTelegramPlatform;
