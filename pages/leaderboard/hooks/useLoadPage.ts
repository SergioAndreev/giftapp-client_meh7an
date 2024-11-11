import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export const useLoadPage = () => {
  useEffect(() => {
    WebApp.BackButton.hide();
    WebApp.SecondaryButton.hide();
    WebApp.MainButton.hide();
  }, []);
};
