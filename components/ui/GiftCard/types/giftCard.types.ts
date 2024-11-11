import { Gift, User } from "@/types/types";

export interface GiftCardButtonProps {
  isStore?: boolean;
  sold: number;
  totalAvailable: number;
  price: number;
  currency: string;
  onClick: () => void;
}

export interface SenderUserProps {
  firstName: string;
  lastName?: string;
  username?: string | null;
  totalGiftsCount: number;
  isPremium: boolean;
  telegramId: number;
}

export interface GiftCardProps {
  gift: Gift;
  transactionId?: string;
  isStore?: boolean;
  which?: number;
  purchaseTime?: Date;
  sender?: SenderUserProps;
  lottieRef?: React.RefObject<any>;
}
