import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import WebApp from "@twa-dev/sdk";
import { GiftList } from "@/components/ui/GiftList";
import { useTranslation } from "react-i18next";
import { InfiniteScrollContainer } from "@/components/ui/InfiniteScroll/InfiniteScrollContainer";
import ShrinkingHeader from "@/components/ui/ShrinkingHeader";

const App: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    WebApp.BackButton.hide();
    WebApp.SecondaryButton.hide();
    WebApp.MainButton.hide();
  }, []);

  return (
    <InfiniteScrollContainer
      loading={loading}
      setLoading={setLoading}
      checkLoading={checkLoading}
      setCheckLoading={setCheckLoading}
      hasNext={hasNext}
      itemHeight={3.4375}
      className={styles.container}
      id="container"
      currentItems={loadedCount}
      defaultItems={9}
    >
      <div className={styles.content}>
        <ShrinkingHeader
          className={styles.header}
          maxShrinkPercentage={20}
          shrinkThreshold={10}
        >
          <h1>{t("gifts.title")}</h1>
          <p>{t("gifts.description")}</p>
        </ShrinkingHeader>

        <GiftList
          isPending={true}
          telegramId={0}
          length={loadedCount}
          infiniteScrollLoader={{
            isLoading: loading,
            setIsLoading: setLoading,
            setCheckLoading: setCheckLoading,
            setHasNext: setHasNext,
            setLoadedCount: setLoadedCount,
          }}
        />
      </div>
    </InfiniteScrollContainer>
  );
};

export default App;
