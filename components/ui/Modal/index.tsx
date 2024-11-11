declare global {
  interface Window {
    __modalOpenTime: number;
  }
}
import React, { useEffect } from "react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import WebApp from "@twa-dev/sdk";
import { DynamicModalProps } from "./types/modal.types";
import { ModalHeader } from "./tsx/ModalHeader";
import { ModalRow } from "./tsx/ModalRow";
import { useModalForm } from "./hooks/useModalForm";
import { useTheme } from "@/components/providers/ThemeProvider";
import { colorMix } from "@/lib/colorMix";

export const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  headerImage,
  title,
  table,
  currency,
  sender,
  buttonText,
  feedback,
  refresher,
}) => {
  const { formData, isLoading, handleInputChange, handleButtonClick } =
    useModalForm({ table, onClose, feedback, refresher });
  const { colors } = useTheme();

  useEffect(() => {
    if (isOpen) {
      WebApp.MainButton.text = buttonText;
      WebApp.MainButton.show();
      WebApp.BackButton.show();

      WebApp.MainButton.onClick(handleButtonClick);
      WebApp.BackButton.onClick(onClose);

      const dimmed = colorMix("#000000", colors.mainBg, 0.4);
      WebApp.setHeaderColor(`#${dimmed}`);

      return () => {
        WebApp.MainButton.offClick(handleButtonClick);
        WebApp.BackButton.offClick(onClose);
        WebApp.BackButton.hide();
        WebApp.MainButton.hide();
        WebApp.setHeaderColor(`#${colors.mainBg.replace("#", "")}`);
      };
    }
  }, [isOpen, buttonText, onClose, formData]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        id="fade"
        className={styles.fade}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          if (
            Date.now() -
              (window as Window & { __modalOpenTime: number }).__modalOpenTime >
            500
          ) {
            onClose();
          }
        }}
      />
      <motion.div
        className={styles.container}
        id="modal"
        initial={{ bottom: "-50vh" }}
        animate={{ bottom: 0 }}
        exit={{ bottom: "0vh" }}
        transition={{ duration: 0.3 }}
        onAnimationStart={() => {
          (window as Window & { __modalOpenTime: number }).__modalOpenTime =
            Date.now();
        }}
      >
        <ModalHeader headerImage={headerImage} onClose={onClose} />
        <div className={styles.content}>
          <div className={styles.information}>
            <h2 className={styles.title}>{title}</h2>
            <table className={styles.table}>
              <tbody>
                {Object.entries(table).map(([key, value], index) => (
                  <ModalRow
                    key={index}
                    index={index}
                    keyName={key}
                    value={value}
                    currency={currency}
                    sender={sender}
                    formData={formData}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    closeModal={onClose}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
};
