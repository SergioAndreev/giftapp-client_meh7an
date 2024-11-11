import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
} from "react";

interface LottieRef {
  stop: () => void;
  play: () => void;
}

interface LottieControllerContextType {
  /** Register a new animation instance with the controller */
  registerAnimation: (id: string, ref: LottieRef) => void;
  /** Remove an animation instance from the controller */
  unregisterAnimation: (id: string) => void;
  /** Play all registered animations */
  playAll: () => void;
  /** Stop all registered animations */
  stopAll: () => void;
}

const LottieControllerContext =
  createContext<LottieControllerContextType | null>(null);

/**
 * Context system for centralized control of multiple Lottie animations
 * throughout the app. Allows playing/stopping all animations simultaneously
 * and managing individual animation references.
 *
 * @example
 * // In root component:
 * <LottieControllerProvider>
 *   <App />
 * </LottieControllerProvider>
 *
 * // In a component with Lottie animation:
 * function AnimatedComponent() {
 *   const lottieRef = useRef(null);
 *   useLottieAnimation('uniqueId', lottieRef);
 *
 *   return <Lottie ref={lottieRef} />;
 * }
 *
 * // To control all animations:
 * function Controller() {
 *   const { playAll, stopAll } = useLottieController();
 *   return <button onClick={playAll}>Play All</button>;
 * }
 */
export const LottieControllerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const animationsRef = useRef(new Map<string, LottieRef>());

  const registerAnimation = useCallback((id: string, ref: LottieRef) => {
    animationsRef.current.set(id, ref);
  }, []);

  const unregisterAnimation = useCallback((id: string) => {
    animationsRef.current.delete(id);
  }, []);

  const playAll = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.play());
  }, []);

  const stopAll = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.stop());
  }, []);

  return (
    <LottieControllerContext.Provider
      value={{
        registerAnimation,
        unregisterAnimation,
        playAll,
        stopAll,
      }}
    >
      {children}
    </LottieControllerContext.Provider>
  );
};

/**
 * Hook to access the Lottie controller context
 * @throws {Error} If used outside of LottieControllerProvider
 * @returns {LottieControllerContextType} Lottie control methods
 */
export const useLottieController = () => {
  const context = useContext(LottieControllerContext);
  if (!context) {
    throw new Error(
      "useLottieController must be used within a LottieControllerProvider"
    );
  }
  return context;
};

/**
 * Hook to register a Lottie animation instance with the controller
 * @param id - Unique identifier for this animation
 * @param ref - React ref containing the Lottie instance
 * @returns {LottieControllerContextType} Lottie control methods
 */
export const useLottieAnimation = (
  id: string,
  ref: React.RefObject<LottieRef>
) => {
  const { registerAnimation, unregisterAnimation } = useLottieController();

  React.useEffect(() => {
    if (ref.current) {
      registerAnimation(id, ref.current);
      return () => unregisterAnimation(id);
    }
  }, [id, ref, registerAnimation, unregisterAnimation]);

  return useLottieController();
};
