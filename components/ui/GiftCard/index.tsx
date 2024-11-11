import { memo, useEffect } from "react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { CachedSVG } from "@/components/ui/CachedSVG";
import { CachedLottie } from "@/components/ui/CachedLottie";
import WebApp from "@twa-dev/sdk";
import { DynamicModal } from "../Modal";
import { GiftCardButton } from "./tsx/GiftCardButton";
import { formatCompactNumber } from "@/lib/formatCompactNumber";
import { GiftCardProps } from "./types/giftCard.types";
import { useGiftCard } from "./hooks/useGiftCard";
import Avatar from "../Avatar";
import { useTranslation } from "react-i18next";
import { useLottieController } from "@/components/providers/LottieProvider";
import constant from "@/constants";
export const GiftCard = memo(
  ({
    gift,
    transactionId,
    isStore,
    which,
    purchaseTime,
    sender,
  }: GiftCardProps) => {
    const { t } = useTranslation();
    const { stopAll, playAll } = useLottieController();
    const {
      background,
      isOpen,
      modalData,
      closeModal,
      handleSendGift,
      handleNavigate,
      handleShowInfo,
    } = useGiftCard({ gift, transactionId, which, purchaseTime, sender, t });

    const senderId = sender?.telegramId;

    useEffect(() => {
      if (!isOpen) {
        playAll();
        WebApp.MainButton.hide();
      } else {
        stopAll();
      }
      return () => {
        playAll();
      };
    }, [isOpen]);

    if (!gift.slug) return null;

    return (
      <div
        className={styles.giftCard}
        style={isStore ? background : senderId ? { cursor: "pointer" } : {}}
        onClick={senderId ? handleShowInfo : undefined}
      >
        {isStore && (
          <div className={styles.pattern}>
            <CachedSVG
              url={`${constant.ASSETS_PREFIX}/patterns/${gift.patternID}.svg`}
            />
          </div>
        )}
        <div className={styles.cardContent}>
          <div className={styles.cardInfo}>
            <div className={styles.topInfo}>
              {senderId && (
                <div className={styles.senderPic}>
                  <Avatar
                    user={sender}
                    style={{
                      width: "4vw",
                      height: "4vw",
                      fontSize: "2vw",
                      display: "flex",
                    }}
                  />
                </div>
              )}
              {isStore || senderId ? (
                <span className={styles.remaining}>
                  {t("store.card.remaining", {
                    remaining: isStore ? formatCompactNumber(gift.sold) : 1,
                    total: formatCompactNumber(gift.totalAvailable),
                  })}
                </span>
              ) : (
                <h4>{gift.name}</h4>
              )}
            </div>
            <motion.div
              className={styles.icon}
              whileTap={
                isStore ? { scale: 0.8, transition: { duration: 0.2 } } : {}
              }
              layoutId={
                `${gift.lottieID}-layout` +
                (isStore ? "-store" : senderId ? "-profile" : "")
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }}
              style={{ fontSize: "7.5rem" }}
              onClick={isStore ? handleNavigate : () => {}}
            >
              <CachedLottie
                url={`${constant.ASSETS_PREFIX}/animations/gifts/${gift.lottieID}.json`}
                loop={true}
                backAndForth={true}
                styles={{
                  width: isStore ? "calc(50vw - 3rem) " : "calc(33vw - 3rem)",
                  height: isStore ? "calc(50vw - 3rem)" : "calc(33vw - 3rem)",
                  maxHeight: isStore ? "45vh" : "30vh",
                  maxWidth: isStore ? "45vh" : "30vh",
                  display: "flex",
                }}
              />
            </motion.div>
          </div>
          {(isStore || senderId) && (
            <h3 style={senderId ? { fontSize: "0.875rem" } : {}}>
              {gift.name}
            </h3>
          )}
          {!senderId && (
            <GiftCardButton
              isStore={isStore}
              sold={gift.sold}
              totalAvailable={gift.totalAvailable}
              price={gift.price}
              currency={gift.currency}
              onClick={isStore ? handleNavigate : handleSendGift}
            />
          )}
        </div>
        <DynamicModal
          isOpen={isOpen}
          currency={gift.currency}
          onClose={closeModal}
          {...modalData!}
        />
      </div>
    );
  }
);

GiftCard.displayName = "GiftCard";
