import { User } from "@/types/types";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationState } from "../types/NavigationState";

export const useLoadPage = (
  userData: User | null,
  navState: NavigationState
) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    WebApp.MainButton.hide();

    if (!location.state || navState.isMe) {
      WebApp.BackButton.hide();
      return;
    }

    const handleBack = () => {
      navigate(navState.from, {
        state: {
          ...userData,
          ...navState,
        },
      });
    };

    WebApp.BackButton.show();
    WebApp.BackButton.onClick(handleBack);

    return () => {
      WebApp.BackButton.offClick(handleBack);
      WebApp.BackButton.hide();
    };
  }, [userData, navState, location.state]);
};
