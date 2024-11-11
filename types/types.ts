import { LottieData } from "@/components/ui/CachedLottie/types/lottie.types";

enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export interface Gift {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  lottieID?: string;
  patternID?: string;
  totalAvailable: number;
  sold: number;
  color: string;
  lottieData?: LottieData;
}

export interface User {
  id: string;
  telegramId: number;
  username?: string | null;
  firstName: string;
  lastName?: string;
  isPremium: boolean;
  gifts: Transaction[];
  transactions: Transaction[];
  pendingGifts: Transaction[];
  totalGiftsCount: number;
  createdAt: Date;
  updatedAt: Date;
  rank?: number;
}

export interface Admin {
  name: string;
  telegramID: number;
  addedBy: number;
  addedAt: Date;
  isActive: boolean;
  role: AdminRole;
}

export enum TransactionStatus {
  PENDING = "PENDING", // Gift is yet to be delivered
  COMPLETED = "COMPLETED", // Gift has been successfully delivered
}

export interface Transaction {
  id: string;
  giftId: string;
  gift?: Gift;
  senderId: number;
  receiverId: number;
  status: "PENDING" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
  paymentId?: string;
  price: number;
  currency: string;
  which?: number;
  sender?: {
    firstName: string;
    lastName?: string;
    username?: string;
    totalGiftsCount: number;
    isPremium: boolean;
    telegramId: number;
  };
  receiver?: {
    firstName: string;
    lastName?: string;
    username?: string;
    totalGiftsCount: number;
    isPremium: boolean;
    telegramId: number;
  };
  event: TransactionType;
}

export enum TransactionType {
  PURCHASED = "PURCHASED",
  SENT = "SENT",
  RECEIVED = "RECEIVED",
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  hasNext: boolean;
}

export interface InvoiceUrls {
  paymentUrl: string;
  webAppUrl: string;
  miniAppUrl: string;
  paymentId: number;
}

export interface PaymentStatus {
  status: TransactionStatus;
  amount: number;
  createdAt: Date;
  paidAt?: Date;
}
