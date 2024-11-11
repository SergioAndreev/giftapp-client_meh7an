import { Transaction } from "@/types/types";

export interface TransactionItemProps {
  transaction: Transaction;
}

export interface TransactionsData {
  items: Transaction[];
  total: number;
  hasNext: boolean;
}
