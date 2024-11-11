import React from "react";
import { PreloaderProvider } from "../PreloadProvider";
import { LoadingScreen } from "./tsx/LoadingScreen";
import { useAssetProvider } from "./parts/assets";

export const PreloaderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const assets = useAssetProvider();
  return (
    <PreloaderProvider assets={assets} loadingScreen={<LoadingScreen />}>
      {children}
    </PreloaderProvider>
  );
};
