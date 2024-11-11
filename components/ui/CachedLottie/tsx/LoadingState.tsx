import React from "react";
import { CSSProperties } from "react";
import localstyles from "./styles.module.scss";

interface LoadingStateProps {
  styles?: CSSProperties;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ styles }) => (
  <div style={styles}>
    <div className={localstyles.loadingContainer} style={styles}>
      <div className={localstyles.loadingPulse} />
    </div>
  </div>
);
