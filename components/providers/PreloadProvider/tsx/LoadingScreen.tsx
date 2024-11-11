import { usePreloader } from "..";
import styles from "./styles.module.scss";

export const LoadingScreen = () => {
  const { progress } = usePreloader();

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingContent}>
        <div className={styles.giftBox}>
          <div className={styles.giftLid}>
            <span className={styles.giftBow}></span>
          </div>
          <div className={styles.giftBoxBody}></div>
        </div>
        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          ></div>
          <span className={styles.progressText}>{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
