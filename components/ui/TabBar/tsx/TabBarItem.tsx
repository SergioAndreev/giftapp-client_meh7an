import { motion } from "framer-motion";
import styles from "../styles.module.scss";
import { isTabActive } from "../parts/isTabActive";
import { goToPage } from "../parts/goToPage";
import { Tab } from "../types/tabBar.types";
import { NavigateFunction } from "react-router-dom";

interface TabBarItemProps {
  tab: Tab;
  currentPath: string;
  navigate: NavigateFunction;
}

export const TabBarItem = ({ tab, currentPath, navigate }: TabBarItemProps) => {
  const Icon = tab.icon;
  const isActive = isTabActive(tab.route, currentPath);

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={(e) => goToPage(e, tab.route, currentPath, navigate)}
      className={`${styles.bottomBarIcons} ${isActive ? styles.active : ""}`}
    >
      <div key={tab.label}>
        <Icon />
      </div>
      <span>{tab.label}</span>
    </motion.div>
  );
};
