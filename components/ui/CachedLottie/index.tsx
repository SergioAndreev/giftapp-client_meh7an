import { memo, forwardRef, useId } from "react";
import { CachedLottieProps } from "./types/lottie.types";
import { useLottieAnimation } from "./hooks/useLottieAnimation";
import { ErrorState } from "./tsx/ErrorState";
import { LoadingState } from "./tsx/LoadingState";
import { useLottieAnimation as useController } from "@/components/providers/LottieProvider";

interface ExtendedLottieProps extends CachedLottieProps {
  animationId?: string;
  excludeFromController?: boolean;
}

/**
 * A memoized Lottie animation component with caching capabilities and controller integration.
 * Supports animation control, custom styling, and various animation configurations.
 *
 * @component
 * @example
 * // Basic usage
 * <CachedLottie
 *   url="https://example.com/animation.json"
 *   styles={{ width: 200, height: 200 }}
 * />
 *
 * // With controller and custom settings
 * <CachedLottie
 *   url="https://example.com/animation.json"
 *   animationId="welcomeAnimation"
 *   loop={false}
 *   speed={1.5}
 *   onComplete={() => console.log('Animation done!')}
 * />
 */
export const CachedLottie = memo(
  forwardRef<{ play: () => void; stop: () => void }, ExtendedLottieProps>(
    (
      {
        url,
        play = true,
        loop = true,
        backAndForth = false,
        styles = { width: 150, height: 150 },
        speed = 1,
        segment,
        onComplete,
        onLoopComplete,
        onEnterFrame,
        onLoad,
        direction = 1,
        className,
        color,
        animationId,
        excludeFromController = false,
      },
      ref
    ) => {
      const uniqueId = useId();
      const id = animationId || uniqueId;

      const { containerRef, error, isLoading, animationRef } =
        useLottieAnimation({
          url,
          play,
          loop,
          backAndForth,
          speed,
          segment,
          direction,
          color,
          onComplete,
          onLoopComplete,
          onEnterFrame,
          onLoad,
        });

      React.useImperativeHandle(ref, () => ({
        play: () => animationRef.current?.play(),
        stop: () => animationRef.current?.pause(),
      }));

      // Only register with controller if not excluded
      if (!excludeFromController) {
        useController(id, {
          current: {
            play: () => animationRef.current?.play(),
            stop: () => animationRef.current?.pause(),
          },
        });
      }

      if (error) {
        return <ErrorState />;
      }

      if (isLoading) {
        return <LoadingState styles={styles} />;
      }

      return <div ref={containerRef} className={className} style={styles} />;
    }
  )
);

CachedLottie.displayName = "CachedLottie";
