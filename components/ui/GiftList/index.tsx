import React from "react";
import styles from "./styles.module.scss";
import { GiftListProps } from "./types/giftList.types";
import { useGiftList } from "./hooks/useGiftList";
import { EmptyGiftList } from "./tsx/EmptyGiftList";
import { GiftGrid } from "./tsx/GiftGrid";
import { LoadingGrid } from "./tsx/LoadingGrid";

export const GiftList: React.FC<GiftListProps> = ({
  isPending,
  telegramId,
  length,
  infiniteScrollLoader,
}) => {
  const { cardsData, hasNext } = useGiftList(
    isPending,
    telegramId,
    infiniteScrollLoader
  );

  return (
    <div
      className={styles.giftsTable}
      style={{
        gap: cardsData.items.length ? "0.5rem" : "0",
      }}
    >
      <GiftGrid items={cardsData.items} length={length} />
      {hasNext && cardsData.items.length > 0 && (
        <div className={styles.loadingGrid}>
          <LoadingGrid length={length} />
        </div>
      )}
      {!hasNext && cardsData.items.length === 0 && <EmptyGiftList />}
    </div>
  );
};
