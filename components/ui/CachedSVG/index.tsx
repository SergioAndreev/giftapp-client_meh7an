import { memo } from "react";
import { SvgLoaderProps } from "./types/cachedSvg";
import { useSvgLoader } from "./hooks/useSvgLoader";
import { LoadingState } from "./tsx/LoadingState";
import { ErrorState } from "./tsx/ErrorState";

export const CachedSVG = memo(({ url, ...props }: SvgLoaderProps) => {
  const { svgContent, error, isLoading } = useSvgLoader(url);

  if (error) {
    return <ErrorState />;
  }

  if (isLoading || !svgContent) {
    return <LoadingState />;
  }

  return <div {...props} dangerouslySetInnerHTML={{ __html: svgContent }} />;
});

CachedSVG.displayName = "CachedSVG";
