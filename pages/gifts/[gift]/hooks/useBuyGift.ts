import { useEffect } from "react";
import { handleBuyGift } from "../parts/handleBuyGift";
import { Gift } from "@/types/types";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";

export const useBuyGift = (
  giftData: Gift | undefined,
  cleanupRef: React.MutableRefObject<(() => void) | undefined>,
  navigate: ReturnType<typeof useNavigate>
) => {
  useEffect(() => {
    if (!giftData?.id) return;

    const onclickItem = () => {
      handleBuyGift(giftData as Gift, cleanupRef, navigate);
    };

    WebApp.MainButton.onClick(onclickItem);

    return () => {
      WebApp.MainButton.offClick(onclickItem);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
  }, [giftData?.id]);
};
