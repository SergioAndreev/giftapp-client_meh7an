import { User } from "@/types/types";

export interface Receipt {
  lottieID: string;
  name: string;
  price: number;
  currency: string;
  sender?: User | null;
  receiver?: User | null;
  transactionId?: number | null;
}

export enum State {
  RECEIVED,
  PURCHASED,
  ALREADY_RECEIVED,
  SELF_RECEIVED,
}
