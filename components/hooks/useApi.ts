import { useEffect, useState } from "react";
import { initializeApi, getApi } from "@/lib/api";

/**
 * Hook that handles Telegram Mini App API initialization
 * Returns the API instance and ready state
 *
 * @example
 * const { api, isReady } = useApi();
 * if (isReady) {
 *   // Safe to use api here
 * }
 */
export const useApi = () => {
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    const initApi = () => {
      try {
        initializeApi();
        setIsApiReady(true);
      } catch (error) {
        console.error("Failed to initialize Telegram Mini App API:", error);
        setIsApiReady(false);
      }
    };

    initApi();
  }, []);

  return {
    api: isApiReady ? getApi() : null,
    isReady: isApiReady,
  };
};
