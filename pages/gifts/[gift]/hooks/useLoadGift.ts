import { fetchGift, getCachedGift } from "@/lib/fetch/gift";
import { Gift } from "@/types/types";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export const useLoadGift = () => {
  const location = useLocation();
  const isStateValid =
    location.state &&
    "patternID" in location.state &&
    "lottieID" in location.state &&
    "id" in location.state;
  const [giftData, setGiftData] = useState<Gift | null>(
    isStateValid ? location.state : null
  );
  const [isLoading, setIsLoading] = useState(!giftData);
  const { gift: giftSlug } = useParams<{ gift: string }>();
  const state = isStateValid ? location.state : null;
  useEffect(() => {
    const loadGiftData = async () => {
      if (!giftSlug || state) return;

      try {
        const cachedGift = getCachedGift(giftSlug);
        if (cachedGift) {
          setGiftData(cachedGift);
          setIsLoading(false);
          return;
        }

        // Fetch gift if not in cache
        await fetchGift(giftSlug, (gift) => {
          setGiftData(gift);
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Failed to fetch gift:", error);
        setIsLoading(false);
      }
    };

    loadGiftData();
  }, [giftSlug, state]);

  return { giftData, isLoading };
};
