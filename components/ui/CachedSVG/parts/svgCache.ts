class SvgCache {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }

  get(url: string): string | undefined {
    return this.cache.get(url);
  }

  set(url: string, content: string): void {
    this.cache.set(url, content);
  }
}

export const svgCache = new SvgCache();
