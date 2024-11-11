import { useEffect, useRef, useState } from "react";
// import lottie from "lottie-web";
import lottie from "lottie-web/build/player/lottie_light";
import { LottieData } from "../types/lottie.types";
import { lottieCache } from "../parts/PersistentLottieCache";
import { updateAnimationColors } from "../parts/colorUtils";

interface UseLottieAnimationProps {
  url: string;
  play?: boolean;
  loop?: boolean;
  backAndForth?: boolean;
  speed?: number;
  segment?: [number, number];
  direction?: 1 | -1;
  color?: string;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (frame: number) => void;
  onLoad?: () => void;
}

export const useLottieAnimation = ({
  url,
  play = true,
  loop = true,
  backAndForth = false,
  speed = 1,
  segment,
  direction = 1,
  color,
  onComplete,
  onLoopComplete,
  onEnterFrame,
  onLoad,
}: UseLottieAnimationProps) => {
  const [animationData, setAnimationData] = useState<LottieData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof lottie.loadAnimation> | null>(
    null
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load animation data
  useEffect(() => {
    const loadAnimation = async (): Promise<void> => {
      try {
        const cached = lottieCache.get(url, color);
        if (cached) {
          setAnimationData(cached);
          onLoad?.();
          return;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load Lottie: ${response.statusText}`);
        }

        const data: LottieData = await response.json();
        const processedData = color ? updateAnimationColors(data, color) : data;

        if (!processedData.v || !processedData.layers) {
          throw new Error("Invalid Lottie animation format");
        }

        lottieCache.set(url, processedData as LottieData, color);
        setAnimationData(processedData as LottieData);
        onLoad?.();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Lottie loading error:", err);
      }
    };
    void loadAnimation();
  }, [url, color, onLoad]);

  // Setup animation and intersection observer
  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    const setupAnimation = () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }

      const bfsAllowed = animationData?.bfs !== 0;
      const shouldUseBackAndForth = backAndForth && bfsAllowed;

      animationRef.current = lottie.loadAnimation({
        container: containerRef.current!,
        animationData,
        renderer: "svg",
        loop: shouldUseBackAndForth ? false : loop,
        autoplay: play,
        rendererSettings: {
          progressiveLoad: true,
          preserveAspectRatio: "xMidYMid slice",
          hideOnTransparent: true,
        },
      });

      animationRef.current.setSpeed(speed);
      animationRef.current.setDirection(direction);

      if (segment) {
        animationRef.current.playSegments(segment, true);
      }

      if (shouldUseBackAndForth) {
        animationRef.current.addEventListener("complete", () => {
          if (!animationRef.current) return;
          // Reverse the direction
          const currentDirection = animationRef.current.playDirection;
          animationRef.current.setDirection((currentDirection * -1) as 1 | -1);

          // If loop is true, play again
          if (loop) {
            animationRef.current.play();
          }

          // Call the original onComplete if provided and we're going backwards
          if (currentDirection === -1 && onComplete) {
            onComplete();
          }
        });
      } else if (onComplete) {
        animationRef.current.addEventListener("complete", onComplete);
      }
      if (onLoopComplete) {
        animationRef.current.addEventListener("loopComplete", onLoopComplete);
      }
      if (onEnterFrame) {
        animationRef.current.addEventListener(
          "enterFrame",
          ({ currentTime }: { currentTime: number }) =>
            onEnterFrame(currentTime)
        );
      }
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animationRef.current) {
              setupAnimation();
            }
          } else {
            if (animationRef.current) {
              animationRef.current.destroy();
              animationRef.current = null;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px",
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [
    animationData,
    play,
    loop,
    speed,
    segment,
    direction,
    onComplete,
    onLoopComplete,
    onEnterFrame,
  ]);

  return {
    containerRef,
    animationRef,
    error,
    isLoading: !animationData && !error,
  };
};
