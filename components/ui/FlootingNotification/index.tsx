import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { CachedLottie } from "../CachedLottie";
import { motion, AnimatePresence } from "framer-motion";
import constant from "@/constants";

interface FloatingNotificationProps {
  lottieID: string;
  title: string;
  description: string;
  buttonText?: string;
  callback?: () => void;
  duration?: number;
}

const FloatingNotification: React.FC<FloatingNotificationProps> = ({
  lottieID,
  title,
  description,
  buttonText = "View",
  callback,
  duration = 5000,
}) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleButtonClick = () => {
    if (callback) {
      callback();
    }
    setShouldRender(false);
  };

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          className={styles.notificationWrapper}
          initial={{ y: 100, opacity: 0, scale: 0.9, filter: "blur(0px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ y: 0, opacity: 0, scale: 0.8, filter: "blur(8px)" }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <div className={styles.notification}>
            <div className={styles.content}>
              <div className={styles.lottieContainer}>
                <CachedLottie
                  url={`${constant.ASSETS_PREFIX}/animations/gifts/${lottieID}.json`}
                  styles={{ width: "1.875rem", height: "1.875rem" }}
                  loop={true}
                  backAndForth={true}
                />
              </div>
              <div className={styles.textContainer}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
              </div>
            </div>
            {buttonText && callback && (
              <button className={styles.button} onClick={handleButtonClick}>
                {buttonText}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNotification;
