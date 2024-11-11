import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import WebApp from "@twa-dev/sdk";

interface ToggleOption {
  value: string;
  label: React.ReactNode;
}

interface ToggleSwitchProps {
  options: [ToggleOption, ToggleOption];
  value: string;
  onChange: (value: string) => void;
  trackWidth?: number;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  options,
  value,
  onChange,
  trackWidth = 5,
}) => {
  const { colors } = useTheme();
  const [leftOption] = options;
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Calculate initial position based on value
  const getButtonPosition = (currentValue: string) =>
    currentValue === leftOption.value ? 0 : trackWidth / 2.4;

  const handleToggle = () => {
    WebApp.HapticFeedback.impactOccurred("heavy");
    onChange(value === options[0].value ? options[1].value : options[0].value);
  };

  useEffect(() => {
    // Remove initial render flag after component mounts
    setIsInitialRender(false);
  }, []);

  return (
    <div
      className={styles.switchBackground}
      onClick={handleToggle}
      style={{ width: `${trackWidth}rem` }}
    >
      <div className={styles.switchInner}>
        <AnimatePresence initial={false}>
          <motion.div
            className={styles.switchButton}
            initial={
              isInitialRender ? { x: `${getButtonPosition(value)}rem` } : false
            }
            animate={{ x: `${getButtonPosition(value)}rem` }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              // Skip animation on initial render
              duration: isInitialRender ? 0 : undefined,
            }}
          />
        </AnimatePresence>
        {options.map((option) => (
          <div
            key={option.value}
            className={styles.switchText}
            style={{
              color: value === option.value ? colors.text : colors.subtitle,
              width: `${trackWidth / 2}rem`,
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};
