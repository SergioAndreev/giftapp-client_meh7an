import {
  fetchTransactions,
  getCachedTransactions,
  hasValidCache,
} from "@/lib/fetch/userTransactions";
import { Transaction } from "@/types/types";
import { useEffect, useState } from "react";

export const useUpdateTransactions = () => {
  const [loading, setLoading] = useState(!hasValidCache());
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
      const cachedData = getCachedTransactions();
      if (cachedData) updateTransactions(cachedData);
      return;
    }

    fetchTransactions(updateTransactions, 10);
  }, [loading]);

  return {
    loading,
    setLoading,
    checkLoading,
    setCheckLoading,
    transactionsData,
  };
};
