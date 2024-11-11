import { LottieData } from "../types/lottie.types";

/**
 * Manages persistent caching of Lottie animations in localStorage with size limits and optimization.
 * Implements automatic cleanup and versioning to prevent storage overflow.
 *
 * @class PersistentLottieCache
 *
 * Key features:
 * - Persists animations to localStorage
 * - Manages cache size (max 4MB total, 2MB per animation)
 * - Implements LRU (Least Recently Used) cleanup
 * - Handles version control for cache format changes
 * - Debounces save operations to reduce storage writes
 *
 * @example
 * ```ts
 * // Using the singleton instance
 * import { lottieCache } from './PersistentLottieCache';
 *
 * // Cache a new animation
 * lottieCache.set('https://example.com/animation.json', animationData);
 *
 * // Retrieve cached animation
 * const cached = lottieCache.get('https://example.com/animation.json');
 * ```
 */
export class PersistentLottieCache {
  private cache = new Map<string, { data: LottieData; lastUsed: number }>();
  private readonly STORAGE_KEY = "lottie_cache_v1";
  private readonly VERSION = 1;
  private saveTimeout: NodeJS.Timeout | null = null;
  private hasInitialized = false;

  constructor() {
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    if (this.hasInitialized) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        interface StoredCache {
          version: number;
          animations: Record<string, { data: LottieData }>;
        }
        const data = JSON.parse(stored) as StoredCache;
        if (data.version === this.VERSION) {
          Object.entries(data.animations).forEach(([key, value]) => {
            this.cache.set(key, {
              data: value.data,
              lastUsed: Date.now(), // Reset last used time on load
            });
          });
        }
      }
    } catch (error) {
      console.error("Error loading Lottie cache:", error);
      localStorage.removeItem(this.STORAGE_KEY);
    }

    this.hasInitialized = true;
  }

  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.saveToStorage();
      this.saveTimeout = null;
    }, 5000);
  }

  private calculateSize(data: string): number {
    return new Blob([data]).size;
  }

  private async saveToStorage(): Promise<void> {
    try {
      // Get most recent animations but also check total size
      const cacheEntries = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => b.lastUsed - a.lastUsed
      );

      let totalSize = 0;
      const safeCacheEntries = [];
      const MAX_CACHE_SIZE = 4 * 1024 * 1024; // 4MB to be safe

      for (const entry of cacheEntries) {
        const entrySize = this.calculateSize(JSON.stringify(entry[1].data));
        if (totalSize + entrySize <= MAX_CACHE_SIZE) {
          safeCacheEntries.push(entry);
          totalSize += entrySize;
        } else {
          break;
        }
      }

      const cacheData = {
        version: this.VERSION,
        animations: Object.fromEntries(safeCacheEntries),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving Lottie cache:", error);
      if (error instanceof Error && error.name === "QuotaExceededError") {
        // If we still get quota error, be more aggressive
        this.clearOldEntries(Math.ceil(this.cache.size * 0.7)); // Clear 70% of entries
        this.saveToStorage();
      }
    }
  }

  private clearOldEntries(count: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastUsed - b.lastUsed)
      .slice(0, count);

    entries.forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  private getCacheKey(url: string, color?: string): string {
    return color ? `${url}:${color}` : url;
  }

  get(url: string, color?: string): LottieData | undefined {
    const key = this.getCacheKey(url, color);
    const item = this.cache.get(key);
    if (item) {
      item.lastUsed = Date.now();
      return item.data;
    }
    return undefined;
  }

  set(url: string, data: LottieData, color?: string): void {
    const key = this.getCacheKey(url, color);

    // Check size before adding
    const newEntrySize = this.calculateSize(JSON.stringify(data));
    if (newEntrySize > 2 * 1024 * 1024) {
      // Skip if single animation is > 2MB
      console.warn("Animation too large for cache:", url);
      return;
    }

    this.cache.set(key, { data, lastUsed: Date.now() });
    this.debouncedSave();

    // Adjusted size check
    if (this.cache.size > 50) {
      // Reduced from 100 to be more conservative
      this.clearOldEntries(10);
    }
  }

  has(url: string, color?: string): boolean {
    return this.cache.has(this.getCacheKey(url, color));
  }
}

export const lottieCache = new PersistentLottieCache();
