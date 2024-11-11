import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { CachedLottie } from "@/components/ui/CachedLottie";
import i18n from "@/i18n";
import { InfiniteScrollContainer } from "@/components/ui/InfiniteScroll/InfiniteScrollContainer";
import { AnimatedItem } from "@/components/ui/InfiniteScroll/AnimatedItem";
import { LoadingPlaceholder } from "@/components/ui/InfiniteScroll/LoadingPlaceholder";
import ShrinkingHeader from "@/components/ui/ShrinkingHeader";
import constant from "@/constants";
import { TransactionItem } from "./tsx/transactionItem";
import { groupTransactionsByDate } from "@/lib/groupTransactionsByDate";
import { useUpdateTransactions } from "./hooks/useUpdateTransactions";
import { LoadingItem } from "./tsx/LoadingItem";
import { useLoadPage } from "./hooks/useLoadPage";

export default function Recent() {
  const { t } = useTranslation();
  const language = i18n.language;

  const {
    loading,
    setLoading,
    checkLoading,
    setCheckLoading,
    transactionsData,
  } = useUpdateTransactions();

  useLoadPage(loading, transactionsData);

  const groupedTransactions = groupTransactionsByDate(
    transactionsData.items,
    language
  );

  return (
    <InfiniteScrollContainer
      loading={loading}
      setLoading={setLoading}
      checkLoading={checkLoading}
      setCheckLoading={setCheckLoading}
      hasNext={transactionsData.hasNext}
      itemHeight={4.5}
      className={styles.container}
      id="container"
      currentItems={transactionsData.items.length}
    >
      <div className={styles.content}>
        <ShrinkingHeader
          className={styles.header}
          maxShrinkPercentage={20}
          shrinkThreshold={10}
        >
          <h1>{t("recentActions.title")}</h1>
          <p>{t("recentActions.description")}</p>
        </ShrinkingHeader>

        {!loading && transactionsData.items.length === 0 ? (
          <div className={styles.emptyState}>
            <CachedLottie
              url={`${constant.ASSETS_PREFIX}/animations/ui/emoji-balloons.json`}
              loop={true}
              styles={{
                height: "calc(min(30vh, 30vw))",
                width: "calc(min(30vh, 30vw))",
              }}
            />
            <h3>{t("recentActions.noHistory.title")}</h3>
            <p>{t("recentActions.noHistory.description")}</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {Object.entries(groupedTransactions).map(
              ([date, dateTransactions]) => (
                <div key={date} className={styles.dateGroup}>
                  <div className={styles.dateHeader}>{date}</div>
                  {dateTransactions.map((transaction, index) => (
                    <AnimatedItem
                      key={transaction.id + transaction.event}
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
              <LoadingPlaceholder count={10} className={styles.loadingArea}>
                <LoadingItem />
              </LoadingPlaceholder>
            )}
          </div>
        )}
      </div>
    </InfiniteScrollContainer>
  );
}
