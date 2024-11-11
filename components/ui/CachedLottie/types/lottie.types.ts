import type { CSSProperties } from "react";

export interface LottieData {
  v: string;
  ip: number;
  fr: number;
  layers: any[];
  [key: string]: any;
}

export interface CachedLottieProps {
  url: string;
  play?: boolean;
  loop?: boolean;
  backAndForth?: boolean;
  styles?: CSSProperties;
  speed?: number;
  segment?: [number, number];
  className?: string;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (frame: number) => void;
  onLoad?: () => void;
  direction?: 1 | -1;
  color?: string;
}
