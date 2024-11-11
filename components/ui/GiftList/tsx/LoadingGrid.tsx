import React from "react";
import styles from "../styles.module.scss";

interface LoadingGridProps {
  length: number;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({ length }) => (
  <div className={styles.giftsGrid}>
    {Array.from({ length: length < 10 ? length : 9 }).map((_, index) => (
      <div key={index} className={styles.giftCard}>
        <div className={styles.loadingCard}></div>
      </div>
    ))}
  </div>
);
