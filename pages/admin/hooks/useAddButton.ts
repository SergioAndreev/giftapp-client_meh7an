import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export default function useAddButton(
  isOpen: boolean,
  activeTab: string,
  giftHandler: () => void,
  adminHandler: () => void
) {
  useEffect(() => {
    if (!isOpen) {
      if (activeTab === "gifts") {
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(giftHandler);
        WebApp.MainButton.text = "Add New Gift";
      } else {
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(adminHandler);
        WebApp.MainButton.text = "Add New Admin";
      }
    }
    return () => {
      if (WebApp) {
        WebApp.MainButton.offClick(giftHandler);
        WebApp.MainButton.offClick(adminHandler);
      }
    };
  }, [isOpen, activeTab]);
}
