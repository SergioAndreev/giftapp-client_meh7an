import { useModal } from "../../../Modal/hooks/useModal";
import { Gift } from "@/types/types";
import { SenderUserProps } from "../../types/giftCard.types";
import { formatDate, hexToBase64 } from "../../parts/giftUtils";
import WebApp from "@twa-dev/sdk";
import { createGiftModalTranslations } from "./translations";

import { TFunction } from "i18next";

interface UseGiftModalProps {
  gift: Gift;
  transactionId?: string;
  which?: number;
  purchaseTime?: Date;
  sender?: SenderUserProps;
  t: TFunction<"translation", undefined>;
}

export const useGiftModal = ({
  gift,
  transactionId,
  which,
  purchaseTime,
  sender,
  t,
}: UseGiftModalProps) => {
  const { isOpen, modalData, openModal, closeModal } = useModal();
  const formattedDate = formatDate(purchaseTime || new Date());
  const translations = createGiftModalTranslations(t);

  const showSendGiftModal = () => {
    const encodedTransactionId = hexToBase64(transactionId || "");
    const { sendGift } = translations;

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

  const showGiftInfoModal = () => {
    const { giftInfo } = translations;

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

  return {
    isOpen,
    modalData,
    closeModal,
    showSendGiftModal,
    showGiftInfoModal,
  };
};
