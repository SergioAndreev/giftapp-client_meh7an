import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Gift } from "@/types/types";
import { hexToBase64, formatDate } from "../parts/giftUtils";
import { useModal } from "../../Modal/hooks/useModal";
import { SenderUserProps } from "../types/giftCard.types";
import { createGiftModalTranslations } from "./useGiftModal/translations";
import { TFunction } from "i18next";

interface UseGiftCardProps {
  gift: Gift;
  transactionId?: string;
  which?: number;
  purchaseTime?: Date;
  sender?: SenderUserProps;
  t: TFunction;
}

export const useGiftCard = ({
  gift,
  transactionId,
  which,
  purchaseTime,
  sender,
  t,
}: UseGiftCardProps) => {
  const navigate = useNavigate();
  const { isOpen, modalData, openModal, closeModal } = useModal();
  const translations = createGiftModalTranslations(t);

  // Simple background calculation
  const background = useMemo(
    () => ({
      background: `linear-gradient(${gift.color}32 0%, ${gift.color}19 100%)`,
    }),
    [gift.color]
  );

  const formattedDate = formatDate(purchaseTime || new Date());

  const handleSendGift = () => {
    const encodedTransactionId = hexToBase64(transactionId || "");
    const { sendGift } = translations;
    console.log("sendGift", sendGift);

    openModal({
      title: sendGift.title,
      table: {
        [sendGift.fields.name]: gift.name,
        [sendGift.fields.date]: formattedDate,
        [sendGift.fields.price]: `${gift.price} ${gift.currency}`,
        [sendGift.fields.availability]: `${which} of ${gift.totalAvailable}`,
      },
      buttonText: sendGift.button,
      feedback: async () => {
        WebApp.switchInlineQuery(encodedTransactionId, ["users"]);
        return Promise.resolve({ success: true, error: "" });
      },
      headerImage: gift.lottieID || "",
      refresher: () => {
        // console.log("refresher");
      },
    });
  };

  const handleShowInfo = () => {
    const { giftInfo } = translations;
    WebApp.HapticFeedback.impactOccurred("light");

    openModal({
      title: gift.name,
      table: {
        [giftInfo.fields.from]: sender?.firstName || "",
        [giftInfo.fields.date]: formattedDate,
        [giftInfo.fields.price]: `${gift.price} ${gift.currency}`,
        [giftInfo.fields.availability]: `${which} of ${gift.totalAvailable}`,
      },
      sender,
      buttonText: giftInfo.button,
      feedback: async () => {
        closeModal();
        return Promise.resolve({ success: true, error: "" });
      },
      headerImage: gift.lottieID || "",
      refresher: () => {
        // console.log("refresher");
      },
    });
  };

  const handleNavigate = () => {
    navigate(`/gifts/${gift.slug}`, {
      state: {
        id: gift.id,
        transactionId,
        name: gift.name,
        slug: gift.slug,
        price: gift.price,
        currency: gift.currency,
        totalAvailable: gift.totalAvailable,
        sold: gift.sold,
        color: gift.color,
        patternID: gift.patternID,
        lottieID: gift.lottieID,
      },
    });
  };

  return {
    background,
    isOpen,
    modalData,
    closeModal,
    handleSendGift,
    handleNavigate,
    handleShowInfo,
  };
};
