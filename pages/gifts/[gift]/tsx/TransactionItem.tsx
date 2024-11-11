import { Purchased, Received, Sent } from "@/components/icons/events";
import Avatar from "@/components/ui/Avatar";
import { Transaction, TransactionType } from "@/types/types";
import { useTranslation } from "react-i18next";
import styles from "../styles.module.scss";
import { Link } from "react-router-dom";

export const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  const { t } = useTranslation();
  const type = transaction.event;

  return (
    <div className={styles.timelineItem}>
      <div className={styles.giftIcon}>
        {transaction.sender && <Avatar user={transaction.sender} size={2.5} />}
        <div className={styles.eventIcon}>
          {type === "RECEIVED" && <Received width="1.4rem" height="1.4rem" />}
          {type === "SENT" && <Sent width="1.4rem" height="1.4rem" />}
          {type === "PURCHASED" && <Purchased width="1.4rem" height="1.4rem" />}
        </div>
      </div>
      <div className={styles.itemContent}>
        <div className={styles.actionType}>
          {t(`singleGift.events.${type}`)}
        </div>
        <div className={styles.giftAction}>
          {type === TransactionType.PURCHASED && (
            <>
              <Link
                to={`/profile/${transaction.sender?.telegramId}`}
                state={{
                  from: location.pathname,
                }}
              >
                {transaction.sender?.firstName}
              </Link>
              {` ${t("singleGift.details.purchased")}`}
            </>
          )}
          {type === TransactionType.SENT && (
            <>
              <Link
                to={`/profile/${transaction.sender?.telegramId}`}
                state={{
                  from: location.pathname,
                }}
              >
                {transaction.sender?.firstName}
              </Link>
              {` ${t("singleGift.details.sentTo")} `}
              <Link
                to={`/profile/${transaction.receiver?.telegramId}`}
                state={{
                  from: location.pathname,
                }}
              >
                {transaction.receiver?.firstName}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
