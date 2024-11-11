import React, { useEffect, useState } from "react";
import GiftsIcon from "@/components/icons/tabs/Gifts";
import styles from "./styles.module.scss";
import { GiftCard } from "@/components/ui/GiftCard";
import { fetchGifts } from "@/lib/fetch/gifts";
import WebApp from "@twa-dev/sdk";
import { Gift } from "@/types/types";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ShrinkingHeader from "@/components/ui/ShrinkingHeader";
const App: React.FC = () => {
  const { t } = useTranslation();
  const [cardsData, setCardsData] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  WebApp.BackButton.hide();
  WebApp.SecondaryButton.hide();

  const GiftList = cardsData.map((card, index) => (
    <div key={index} className={styles.giftCard}>
      <motion.div key={index} style={{ height: "100%" }}>
        <GiftCard gift={card} isStore />
      </motion.div>
    </div>
  ));

  useEffect(() => {
    WebApp.MainButton.hide();
    (async () => {
      fetchGifts(setCardsData);
      setLoading(false);
    })();
    const container = document.getElementById("container");
    if (!container) return;
  }, []);

  return (
    <div id="container" className={styles.container}>
      <div className={styles.content}>
        <ShrinkingHeader
          className={styles.header}
          maxShrinkPercentage={20}
          shrinkThreshold={20}
        >
          <GiftsIcon />
          <h1>{t("store.title")}</h1>
          <p>{t("store.description")}</p>
        </ShrinkingHeader>

        <div className={styles.giftsGrid}>
          {!loading && GiftList}
          {cardsData.length === 0 &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.loadingCard}>
                <div style={{ height: "100%" }}></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
