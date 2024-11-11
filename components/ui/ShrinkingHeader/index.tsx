import React, { useEffect, useState, ReactNode } from "react";
import { pxToRem } from "@/lib/pxToRem";
import styles from "./styles.module.scss";

interface ShrinkingHeaderProps {
  children: ReactNode;
  className?: string;
  maxShrinkPercentage?: number;
  shrinkThreshold?: number;
  containerId?: string;
}

const ShrinkingHeader: React.FC<ShrinkingHeaderProps> = ({
  children,
  className = "",
  maxShrinkPercentage = 20,
  shrinkThreshold = 10.5,
  containerId = "container",
}) => {
  const [topRem, setTopRem] = useState<number>(0);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTopRem = pxToRem(target.scrollTop);
      setTopRem(scrollTopRem);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerId]);

  useEffect(() => {
    const header = document.getElementById("shrinking-header");
    if (!header) return;

    const reductionPercentage = Math.min(
      (topRem / shrinkThreshold) * maxShrinkPercentage,
      maxShrinkPercentage
    );
    const scale = 1 - reductionPercentage / 100;
    header.style.transform = `scale(${scale < 1 ? scale : 1})`;
    header.style.transformOrigin = "center bottom";
  }, [topRem, maxShrinkPercentage, shrinkThreshold]);

  return (
    <div id="shrinking-header" className={`${styles.header} ${className}`}>
      {children}
    </div>
  );
};

export default ShrinkingHeader;
