import styles from "../styles.module.scss";
export const LoadingItem = () => (
  <div className={`${styles.timelineItem} ${styles.loading}`}>
    <div className={styles.giftIcon}>
      <div className={styles.placeholder} />
    </div>
    <div className={styles.itemContent}>
      <div className={styles.actionType}>
        <div className={styles.placeholder} />
      </div>
      <div className={styles.giftAction}>
        <div className={styles.placeholder} />
      </div>
    </div>
  </div>
);
