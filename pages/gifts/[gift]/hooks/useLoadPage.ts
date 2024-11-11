import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useLoadPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const onclickItem = () => {
      navigate("/");
    };
    const platform = WebApp.platform;
    if (platform === "ios")
      WebApp.HapticFeedback.notificationOccurred("success");
    if (platform === "android") WebApp.HapticFeedback.impactOccurred("light");
    WebApp.MainButton.text = "Buy a Gift";
    setTimeout(() => {
      WebApp.MainButton.show();
    }, 500);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onclickItem);
    WebApp.SecondaryButton.hide();

    return () => {
      WebApp.BackButton.offClick(onclickItem);
      WebApp.BackButton.hide();
      WebApp.MainButton.hide();
    };
  }, []);
};
