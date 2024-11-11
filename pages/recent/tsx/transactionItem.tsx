import { useTranslation } from "react-i18next";
import { TransactionItemProps } from "../types/TransactionItemProps";
import { TransactionType } from "@/types/types";
import { CachedLottie } from "@/components/ui/CachedLottie";
import constant from "@/constants";
import { Purchased, Received, Sent } from "@/components/icons/events";
import { Link } from "react-router-dom";
import styles from "../styles.module.scss";

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  const { t } = useTranslation();
  const type = transaction.event;
  const otherParty =
    type === TransactionType.SENT
      ? transaction.receiver?.firstName
      : type === TransactionType.RECEIVED
      ? transaction.sender?.firstName
      : null;

  return (
    <div className={styles.timelineItem}>
      <div className={styles.giftIcon}>
        <CachedLottie
          url={`${constant.ASSETS_PREFIX}/animations/gifts/${transaction.gift?.lottieID}.json`}
          loop={false}
          styles={{
            height: "100%",
            width: "100%",
          }}
        />
        <div className={styles.eventIcon}>
          {type === "RECEIVED" && <Received width="100%" height="100%" />}
          {type === "SENT" && <Sent width="100%" height="100%" />}
          {type === "PURCHASED" && <Purchased width="100%" height="100%" />}
        </div>
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.itemContent}>
          <div className={styles.actionType}>
            {t(`recentActions.events.${type}`)}
          </div>
          <div className={styles.giftName}>
            {transaction.gift?.name || "Gift"}
          </div>
        </div>
        <div className={styles.itemDetails}>
          {type !== TransactionType.PURCHASED && (
            <div className={styles.otherParty}>
              {type === "SENT"
                ? t("recentActions.events.toWhom", {
                    to: otherParty,
                    user: () => (
                      <Link to={`/profile/${transaction.receiver?.telegramId}`}>
                        {otherParty}
                      </Link>
                    ),
                  })
                : t("recentActions.events.fromWhom")}{" "}
              <Link
                to={`/profile/${
                  type === "SENT"
                    ? transaction.receiver?.telegramId
                    : transaction.sender?.telegramId
                }`}
                state={{
                  from: "/recent",
                }}
              >
                {otherParty}
              </Link>
            </div>
          )}
          {type === TransactionType.PURCHASED && (
            <div className={styles.price}>
              -{transaction.price} {transaction.currency}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
