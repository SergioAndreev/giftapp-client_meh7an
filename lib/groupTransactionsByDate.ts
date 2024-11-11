import { Transaction } from "@/types/types";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";

export const groupTransactionsByDate = (
  transactions: Transaction[],
  language: string
) => {
  const grouped: { [key: string]: Transaction[] } = {};
  transactions.forEach((transaction) => {
    const date = format(new Date(transaction.updatedAt), "d MMMM", {
      locale: language === "en" ? enUS : ru,
    }).toUpperCase();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  return grouped;
};
