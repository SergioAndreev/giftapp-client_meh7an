import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { TransactionsData } from "../types/TransactionItemProps";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useLoadPage = (
  loading: boolean,
  transactionsData: TransactionsData
) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    const action = () => navigate("/");
    if (transactionsData.items.length === 0 && !loading) {
      WebApp.MainButton.onClick(action);
      WebApp.MainButton.text = t("gifts.openStore");
      WebApp.MainButton.show();
    }
    return () => {
      WebApp.MainButton.offClick(action);
      WebApp.MainButton.hide();
    };
  }, [transactionsData]);

  useEffect(() => {
    const backAction = () => navigate("/profile");
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(backAction);
    return () => {
      WebApp.BackButton.offClick(backAction);
      WebApp.BackButton.hide();
    };
  }, []);
};
