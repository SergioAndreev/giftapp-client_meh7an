import { Transaction } from "@/types/types";

export interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setCheckLoading: (value: boolean) => void;
  setHasNext: (value: boolean) => void;
  setLoadedCount: (value: number) => void;
}

export interface GiftListProps {
  isPending: boolean;
  telegramId: number;
  length: number;
  infiniteScrollLoader: InfiniteScrollLoaderProps;
}

export interface PaginatedGiftResponse {
  items: Transaction[];
  total: number;
  hasNext: boolean;
}
