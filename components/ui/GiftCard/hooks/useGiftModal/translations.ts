import { TFunction } from "i18next";

export const createGiftModalTranslations = (t: TFunction) => ({
  sendGift: {
    title: t("modal.sendGift.title"),
    button: t("modal.sendGift.button"),
    fields: {
      name: t("modal.sendGift.fields.name"),
      date: t("modal.sendGift.fields.date"),
      price: t("modal.sendGift.fields.price"),
      availability: t("modal.sendGift.fields.availability"),
    },
  },
  giftInfo: {
    button: t("modal.giftInfo.button"),
    fields: {
      from: t("modal.giftInfo.fields.from"),
      date: t("modal.giftInfo.fields.date"),
      price: t("modal.giftInfo.fields.price"),
      availability: t("modal.giftInfo.fields.availability"),
    },
  },
});
