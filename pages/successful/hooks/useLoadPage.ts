import { useEffect } from "react";
import { Receipt, State } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAllGiftsCache } from "@/lib/fetch/userGifts";
import { clearAllTransactionCache } from "@/lib/fetch/transaction";
import { clearAllGiftTransactionCaches } from "@/lib/fetch/giftTransactions";
import { clearAllUserCache } from "@/lib/fetch/user";
import WebApp from "@twa-dev/sdk";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useTranslation } from "react-i18next";
import { successStateCalc } from "../parts/successState";

export const useLoadPage = () => {
  const navigate = useNavigate();
  const { showNotification, hideNotification } = useNotification();
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state;

  const { lottieID, name, price, currency, sender, receiver } =
    state as Receipt;
  const successState = successStateCalc(sender, receiver);
  const isReceived =
    successState === State.RECEIVED || successState === State.SELF_RECEIVED;

  const onClickMainButton = () => {
    navigate(isReceived ? "/profile" : "/gifts");
  };
  useEffect(() => {
    if (successState === State.ALREADY_RECEIVED) {
      navigate("/");
      return;
    }
    clearAllGiftsCache();
    clearAllTransactionCache();
    clearAllGiftTransactionCaches();
    clearAllUserCache();
    WebApp.HapticFeedback.notificationOccurred("warning");
    const notifiaction = showNotification({
      lottieID,
      title: isReceived
        ? t("successful.notification.receivedTitle")
        : t("successful.notification.purchasedTitle"),
      description: isReceived
        ? t("successful.notification.receivedDescription", {
            name: name,
            firstName:
              successState === State.SELF_RECEIVED
                ? t("successful.notification.yourself")
                : sender?.firstName,
          })
        : t("successful.notification.purchasedDescription"),
      buttonText: isReceived
        ? t("successful.notification.receivedButton")
        : t("successful.notification.purchasedButton"),
      duration: 7000,
      callback: () => {
        if (isReceived) {
          hideNotification(notifiaction);
          navigate("/profile");
        } else {
          hideNotification(notifiaction);
          navigate("/gifts");
        }
      },
    });
    const onclickItem = () => {
      navigate("/");
    };
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onclickItem);

    WebApp.MainButton.show();
    WebApp.MainButton.text = isReceived
      ? t("successful.buttons.profile")
      : t("successful.buttons.send");
    WebApp.MainButton.onClick(onClickMainButton);

    if (!isReceived) {
      WebApp.SecondaryButton.position = "bottom";
      WebApp.SecondaryButton.show();
      WebApp.SecondaryButton.text = t("successful.buttons.store");
      WebApp.SecondaryButton.onClick(onclickItem);
    }
    return () => {
      WebApp.BackButton.offClick(onclickItem);
      WebApp.MainButton.offClick(onClickMainButton);
      WebApp.SecondaryButton.offClick(onclickItem);
      WebApp.SecondaryButton.hide();
      WebApp.MainButton.hide();
      WebApp.BackButton.hide();
      hideNotification(notifiaction);
    };
  }, []);

  return {
    isReceived,
    lottieID,
    name,
    price,
    currency,
  };
};
