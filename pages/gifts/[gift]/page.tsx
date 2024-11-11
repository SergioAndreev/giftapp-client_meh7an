import React, { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { formatCompactNumber } from "@/lib/formatCompactNumber";
import { CachedLottie } from "@/components/ui/CachedLottie";
import { CurrencyIcon } from "@/components/icons/currencies";
import { Gift } from "@/types/types";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { InfiniteScrollContainer } from "@/components/ui/InfiniteScroll/InfiniteScrollContainer";
import { AnimatedItem } from "@/components/ui/InfiniteScroll/AnimatedItem";
import { LoadingPlaceholder } from "@/components/ui/InfiniteScroll/LoadingPlaceholder";
import { CachedSVG } from "@/components/ui/CachedSVG";
import constant from "@/constants";
import { TransactionItem } from "./tsx/TransactionItem";
import { groupTransactionsByDate } from "@/lib/groupTransactionsByDate";
import { useLoadGift } from "./hooks/useLoadGift";
import { LoadingItem } from "./tsx/LoadingItem";
import { currencyColor } from "@/lib/currencyColor";
import { useLoadPage } from "./hooks/useLoadPage";
import { useLoadTransactions } from "./hooks/useLoadTransactions";
import { useNavigate } from "react-router-dom";
import { useBuyGift } from "./hooks/useBuyGift";

const SingleGift: React.FC = () => {
  const { t } = useTranslation();
  const language = i18n.language;
  const { giftData, isLoading } = useLoadGift();
  const {
    transactionsData,
    loading,
    checkLoading,
    setCheckLoading,
    setLoading,
  } = useLoadTransactions(giftData as Gift);

  useLoadPage();
  const cleanupRef = useRef<(() => void) | undefined>();
  const navigate = useNavigate();

  useBuyGift(giftData as Gift, cleanupRef, navigate);

  const {
    name,
    price,
    currency,
    totalAvailable,
    sold,
    color,
    patternID,
    lottieID,
  } = giftData || {};

  const groupedTransactions = groupTransactionsByDate(
    transactionsData.items,
    language
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading...</div>
      </div>
    );
  }

  if (!giftData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>Gift not found</div>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      loading={loading}
      setLoading={setLoading}
      checkLoading={checkLoading}
      setCheckLoading={setCheckLoading}
      hasNext={transactionsData.hasNext}
      itemHeight={4.5}
      className={`${styles.container} customScrollBar`}
      id="gift-transactions"
      currentItems={transactionsData.items.length}
    >
      <div className={styles.content}>
        <div className={styles.section}>
          <div
            className={styles.giftIcon}
            style={{
              background: `linear-gradient(${color}32 0%, ${color}19 100%)`,
            }}
          >
            <div className={styles.pattern}>
              <CachedSVG
                url={`${constant.ASSETS_PREFIX}/patterns/${patternID}.svg`}
              />
            </div>
            <motion.div
              animate={{ x: 0, y: 0 }}
              transition={{
                duration: 0.3,
                x: { ease: "easeIn", duration: 1.75 },
                y: {
                  duration: 0.75,
                  ease: [0.68, 0.27, 0.27, 1.55],
                  times: [0, 0.25, 0.5],
                  keyframes: [0, -50, 0],
                },
                layout: {
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                },
              }}
              layoutId={`${lottieID}-layout-store`}
              style={{
                fontSize: "16.6rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "75vw",
                height: "75vw",
                margin: "10vw 0",
                maxHeight: "75vh",
                maxWidth: "75vh",
              }}
            >
              <CachedLottie
                url={`${constant.ASSETS_PREFIX}/animations/gifts/${lottieID}.json`}
                styles={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                }}
                loop={true}
                backAndForth={true}
              />
            </motion.div>
          </div>
          <div className={styles.informationArea}>
            <div className={styles.titleArea}>
              <h1 className={styles.title}>{name}</h1>
              <span className={styles.count}>
                {formatCompactNumber(sold ?? 0)} of{" "}
                {formatCompactNumber(totalAvailable ?? 0)}
              </span>
            </div>
            <p className={styles.description}>{t("singleGift.description")}</p>
            <div className={styles.priceArea}>
              <span
                className={styles.currency}
                style={{ backgroundColor: currencyColor(currency as string) }}
              >
                <CurrencyIcon currency={currency || ""} />
              </span>
              {price} {currency}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>{t("recentActions.title")}</div>
          <div className={styles.timeline}>
            {Object.entries(groupedTransactions).map(
              ([date, dateTransactions]) => (
                <div key={date} className={styles.dateGroup}>
                  <div className={styles.dateHeader}>{date}</div>
                  {dateTransactions.map((transaction, index) => (
                    <AnimatedItem
                      key={transaction.createdAt + transaction.event}
                      index={index}
                      totalItems={transactionsData.items.length}
                    >
                      <TransactionItem transaction={transaction} />
                    </AnimatedItem>
                  ))}
                </div>
              )
            )}

            {transactionsData.hasNext && (
              <LoadingPlaceholder count={5} className={styles.loadingArea}>
                <LoadingItem />
              </LoadingPlaceholder>
            )}
          </div>
        </div>
      </div>
    </InfiniteScrollContainer>
  );
};

export default SingleGift;
