import { lottieCache } from "../parts/PersistentLottieCache";
import { updateAnimationColors } from "../parts/colorUtils";

/**
 * Preloads Lottie animations into cache, optionally with color variations.
 * Fetches and caches animations only if they're not already in the cache.
 *
 * @param urls - Array of Lottie animation URLs to preload
 * @param colors - Optional array of hex colors to create color variations
 *
 * @example
 * ```ts
 * // Basic preloading
 * await preloadLottieAnimations([
 *   'https://example.com/animation1.json',
 *   'https://example.com/animation2.json'
 * ]);
 *
 * // Preload with color variations
 * await preloadLottieAnimations(
 *   ['https://example.com/animation.json'],
 *   ['#FF0000', '#00FF00'] // Will create red and green versions
 * );
 * ```
 *
 * @remarks
 * - Silently handles errors for individual animations to prevent one failure from blocking others
 * - Creates separate cache entries for each color variation
 * - Uses parallel loading for better performance
 * - Skips already cached animations to prevent unnecessary fetches
 */
export const preloadLottieAnimations = async (
  urls: string[],
  colors?: string[]
): Promise<void> => {
  try {
    const loadRequests: Promise<void>[] = [];

    for (const url of urls) {
      if (!lottieCache.has(url)) {
        loadRequests.push(
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              lottieCache.set(url, data);
            })
        );
      }

      if (colors) {
        for (const color of colors) {
          if (!lottieCache.has(url, color)) {
            loadRequests.push(
              fetch(url)
                .then((res) => res.json())
                .then((data) => {
                  const colorized = updateAnimationColors(data, color);
                  lottieCache.set(url, colorized, color);
                })
            );
          }
        }
      }
    }

    await Promise.all(loadRequests);
  } catch (error) {
    console.error("Error preloading animations:", error);
  }
};
