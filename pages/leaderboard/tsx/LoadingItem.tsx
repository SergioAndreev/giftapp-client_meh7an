import styles from "../styles.module.scss";
export const LoadingItem = () => (
  <div className={`${styles.leaderboardItem} ${styles.loading}`}>
    <div className={styles.userInfo}>
      <div className={styles.avatar}>
        <div className={styles.avatarPlaceholder}></div>
      </div>
      <div className={styles.userContent}>
        <div className={styles.userDetails}>
          <p className={styles.name}></p>
          <div className={styles.gifts}></div>
        </div>
        <div className={styles.rank}></div>
      </div>
    </div>
  </div>
);
