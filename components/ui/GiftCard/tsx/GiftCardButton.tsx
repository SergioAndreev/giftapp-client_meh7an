import { memo } from "react";
import styles from "../styles.module.scss";
import { CurrencyIcon } from "@/components/icons/currencies";
import { GiftCardButtonProps } from "../types/giftCard.types";
import { useTranslation } from "react-i18next";
import WebApp from "@twa-dev/sdk";
export const GiftCardButton = memo(
  ({
    isStore,
    sold,
    totalAvailable,
    price,
    currency,
    onClick,
  }: GiftCardButtonProps) => {
    const { t } = useTranslation();
    return (
      <button
        className={`${styles.price} ${
          isStore && sold === totalAvailable ? styles.disabled : ""
        }`}
        onClick={() =>
          (!isStore || sold !== totalAvailable) &&
          WebApp.HapticFeedback.impactOccurred("light") &&
          onClick()
        }
      >
        {!isStore ? (
          <span>{t("gifts.card.send")}</span>
        ) : sold === totalAvailable ? (
          <span>{t("gifts.card.soldOut")}</span>
        ) : (
          <>
            <CurrencyIcon currency={currency} />
            <span>
              {price} {currency}
            </span>
          </>
        )}
      </button>
    );
  }
);

GiftCardButton.displayName = "GiftCardButton";
