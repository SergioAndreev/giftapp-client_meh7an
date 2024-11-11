import styles from "../styles.module.scss";

interface TabBarContainerProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export const TabBarContainer = ({
  children,
  isVisible,
}: TabBarContainerProps) => (
  <div
    className={`${styles.bottomBar} tabBar`}
    style={{ display: isVisible ? "flex" : "none" }}
  >
    {children}
  </div>
);
