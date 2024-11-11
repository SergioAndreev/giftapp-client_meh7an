import React, { createContext, useContext, useEffect, useState } from "react";
import { lottieCache } from "@/components/ui/CachedLottie/parts/PersistentLottieCache";
import { updateAnimationColors } from "@/components/ui/CachedLottie/parts/colorUtils";
import { svgCache } from "@/components/ui/CachedSVG/parts/svgCache";

interface PreloadAsset {
  /** Type of asset to preload */
  type: "lottie" | "image" | "svg";
  /** URL of the asset */
  url: string;
  /** Optional color variants for Lottie animations */
  colors?: string[];
}

interface PreloaderContextType {
  isLoading: boolean;
  progress: number;
  totalAssets: number;
  loadedAssets: number;
}

const PreloaderContext = createContext<PreloaderContextType>({
  isLoading: true,
  progress: 0,
  totalAssets: 0,
  loadedAssets: 0,
});

/**
 * Hook to access preloader state and progress
 * @returns {PreloaderContextType} Current loading state and progress
 *
 * @example
 * function LoadingScreen() {
 *   const { progress, loadedAssets, totalAssets } = usePreloader();
 *   return <ProgressBar value={progress} />;
 * }
 */
export const usePreloader = () => useContext(PreloaderContext);

interface PreloaderProviderProps {
  assets: PreloadAsset[];
  loadingScreen: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Global asset preloader system that handles loading and caching of Lottie animations,
 * images, and SVGs before showing the main app content.
 *
 * Features:
 * - Parallel asset loading
 * - Progress tracking
 * - Minimum load time to prevent flashing
 * - Caching for Lottie animations with color variants
 * - SVG validation and caching
 *
 * @example
 * const assets = [
 *   { type: 'lottie', url: '/animations/success.json', colors: ['#FF0000'] },
 *   { type: 'svg', url: '/icons/gift.svg' },
 *   { type: 'image', url: '/images/banner.png' }
 * ];
 *
 * <PreloaderProvider
 *   assets={assets}
 *   loadingScreen={<LoadingAnimation />}
 * >
 *   <App />
 * </PreloaderProvider>
 */
export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({
  assets,
  loadingScreen,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [startTime] = useState(Date.now());
  const totalAssets = assets.reduce((total, asset) => {
    if (asset.type === "lottie" && asset.colors) {
      return total + 1 + asset.colors.length;
    }
    return total + 1;
  }, 0);

  const preloadImage = async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setLoadedAssets((prev) => prev + 1);
        resolve();
      };
      img.onerror = reject;
    });
  };

  const preloadSVG = async (url: string): Promise<void> => {
    try {
      if (svgCache.has(url)) {
        const cachedContent = svgCache.get(url);
        if (cachedContent) {
          setLoadedAssets((prev) => prev + 1);
          return;
        }
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load SVG");
      const svgText = await response.text();

      if (!svgText.includes("<svg")) {
        throw new Error("Invalid SVG");
      }

      svgCache.set(url, svgText);
      setLoadedAssets((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading SVG:", error);
      throw error;
    }
  };

  const preloadLottie = async (
    url: string,
    colors?: string[]
  ): Promise<void> => {
    try {
      if (!lottieCache.has(url)) {
        const response = await fetch(url);
        const data = await response.json();
        lottieCache.set(url, data);
        setLoadedAssets((prev) => prev + 1);

        if (colors) {
          for (const color of colors) {
            if (!lottieCache.has(url, color)) {
              const colorized = updateAnimationColors(data, color);
              lottieCache.set(url, colorized, color);
              setLoadedAssets((prev) => prev + 1);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading Lottie:", error);
      throw error;
    }
  };

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const loadPromises = assets.map((asset) => {
          switch (asset.type) {
            case "lottie":
              return preloadLottie(asset.url, asset.colors);
            case "image":
              return preloadImage(asset.url);
            case "svg":
              return preloadSVG(asset.url);
            default:
              return Promise.resolve();
          }
        });

        await Promise.all(loadPromises);

        const loadTime = Date.now() - startTime;
        const minLoadTime = 1000; // 1 second minimum (for the beautiful loading screen)

        // If we loaded too fast, wait the remaining time
        if (loadTime < minLoadTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadTime - loadTime)
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading assets:", error);
        setIsLoading(false);
      }
    };

    preloadAssets();
  }, [assets, startTime]);

  const contextValue = {
    isLoading,
    progress: (loadedAssets / totalAssets) * 100,
    totalAssets,
    loadedAssets,
  };

  return (
    <PreloaderContext.Provider value={contextValue}>
      {isLoading ? loadingScreen : children}
    </PreloaderContext.Provider>
  );
};
