import {
  fetchGiftTransactions,
  getCachedGiftTransactions,
  hasValidCache,
} from "@/lib/fetch/giftTransactions";
import { Gift, Transaction } from "@/types/types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useLoadTransactions = (giftData: Gift) => {
  const location = useLocation();
  const state = location.state;
  const [checkLoading, setCheckLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState<{
    items: Transaction[];
    total: number;
    hasNext: boolean;
  }>({
    items: [],
    total: 0,
    hasNext: true,
  });

  const [loading, setLoading] = useState(
    !hasValidCache(state?.id || giftData?.id)
  );

  useEffect(() => {
    const updateTransactions = (data: {
      items: Transaction[];
      total: number;
      hasNext: boolean;
    }) => {
      setTransactionsData(data);
      if (loading) {
        setLoading(false);
        setCheckLoading(false);
      }
    };

    if (!loading || !transactionsData.hasNext) {
      if (giftData?.id) {
        const cachedData = getCachedGiftTransactions(giftData.id);
        if (cachedData) updateTransactions(cachedData);
      }
      return;
    }

    if (!giftData?.id) return;

    fetchGiftTransactions(giftData.id, updateTransactions, 10);
  }, [loading, giftData?.id, transactionsData.hasNext]);

  return {
    transactionsData,
    loading,
    checkLoading,
    setCheckLoading,
    setLoading,
  };
};
