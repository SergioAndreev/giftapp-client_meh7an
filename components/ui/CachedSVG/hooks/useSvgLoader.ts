import { useState, useEffect } from "react";
import { svgCache } from "../parts/svgCache";

interface UseSvgLoaderResult {
  svgContent: string;
  error: Error | null;
  isLoading: boolean;
}

export const useSvgLoader = (url: string): UseSvgLoaderResult => {
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        setIsLoading(true);

        if (svgCache.has(url)) {
          const cachedContent = svgCache.get(url);
          if (cachedContent) {
            setSvgContent(cachedContent);
            setIsLoading(false);
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
        setSvgContent(svgText);
      } catch (err) {
        setError(err as Error);
        console.error("Error loading SVG:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSvg();
  }, [url]);

  return { svgContent, error, isLoading };
};
