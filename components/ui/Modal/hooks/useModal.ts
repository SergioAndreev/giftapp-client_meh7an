import { useState, useCallback } from "react";
import { DynamicModalProps } from "../types/modal.types";
import WebApp from "@twa-dev/sdk";
import { useTheme } from "@/components/providers/ThemeProvider";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();
  const [modalData, setModalData] = useState<Omit<
    DynamicModalProps,
    "isOpen" | "onClose"
  > | null>(null);

  const openModal = useCallback(
    (data: Omit<DynamicModalProps, "isOpen" | "onClose">) => {
      setModalData(data);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    const modal = document.getElementById("modal");
    const fade = document.getElementById("fade");
    WebApp.setHeaderColor(`#${colors.mainBg.replace("#", "")}`);
    if (modal && fade) {
      modal.style.bottom = "-100vh";
      modal.style.transition = "bottom 0.6s";
      fade.style.opacity = "0";
      fade.style.transition = "opacity 0.6s";
    }

    setTimeout(() => {
      setIsOpen(false);
      setModalData(null);
    }, 500);
  }, [colors]);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
  };
};
