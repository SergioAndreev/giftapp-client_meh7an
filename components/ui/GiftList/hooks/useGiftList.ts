import { useEffect, useState } from "react";
import { Transaction } from "@/types/types";
import { fetchUserGifts, getCachedGifts } from "@/lib/fetch/userGifts";
import { InfiniteScrollLoaderProps } from "../types/giftList.types";
export const useGiftList = (
  isPending: boolean,
  telegramId: number,
  infiniteScrollLoader: InfiniteScrollLoaderProps
) => {
  const {
    isLoading,
    setIsLoading,
    setCheckLoading,
    setHasNext,
    setLoadedCount,
  } = infiniteScrollLoader;

  const [cardsData, setCardsData] = useState<PaginatedResponse<Transaction[]>>({
    items: [],
    total: 0,
    hasNext: true,
  });

  useEffect(() => {
    const updateGifts = (data: PaginatedResponse<Transaction[]>) => {
      setCardsData(data);
      if (isLoading) {
        setIsLoading(false);
        setCheckLoading(false);
      }
      setHasNext(data.hasNext);

      setLoadedCount(data.items.length);
    };

    if (!isLoading || !cardsData.hasNext) {
      const cachedData = getCachedGifts(isPending, telegramId);
      if (cachedData) {
        updateGifts(cachedData);
      }
      return;
    }

    fetchUserGifts(updateGifts, isPending, telegramId);
  }, [isLoading, isPending, telegramId]);

  return {
    cardsData,
    isLoading: isLoading,
    hasNext: cardsData.hasNext,
  };
};
