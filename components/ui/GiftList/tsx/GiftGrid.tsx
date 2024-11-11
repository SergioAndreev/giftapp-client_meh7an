import React from "react";
import { GiftCard } from "@/components/ui/GiftCard";
import styles from "../styles.module.scss";
import { Transaction } from "@/types/types";
import { motion } from "framer-motion";
interface GiftGridProps {
  items: Transaction[];
  length: number;
}

export const GiftGrid: React.FC<GiftGridProps> = ({ items, length }) => {
  return (
    <div className={styles.giftsGrid}>
      {items.map((item, index) => (
        <div key={index} className={styles.giftCard}>
          {item.gift && (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ height: "100%" }}
            >
              <GiftCard
                gift={item.gift}
                sender={item.sender}
                transactionId={item.id}
                isStore={false}
                which={item.which ?? 0}
                purchaseTime={item.updatedAt}
              />
            </motion.div>
          )}
        </div>
      ))}
      {items.length === 0 &&
        !!length &&
        Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className={styles.giftCard}>
            <div key={index} className={styles.loadingCard}>
              <div style={{ height: "100%" }}></div>
            </div>
          </div>
        ))}
    </div>
  );
};
