import { fetchUser } from "@/lib/fetch/user";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { NavigationState } from "../types/NavigationState";
import WebApp from "@twa-dev/sdk";
import { User } from "@/types/types";

export const useLoadUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const { id } = useParams();
  const location = useLocation();
  const navState: NavigationState = {
    from: location.state?.from || "/",
    isMe:
      location.state?.isMe ||
      (id && parseInt(id) === WebApp.initDataUnsafe.user?.id),
    imageLayoutId: location.state?.imageLayoutId || "1",
    userDataFromState: location.state?.userDataFromState,
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!id) {
        setError("No user ID provided");
        return;
      }

      try {
        if (navState.userDataFromState) {
          setUserData(navState.userDataFromState);
        } else {
          await fetchUser(Number(id), setUserData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user data"
        );
      }
    };

    loadUserData();
  }, [id, location.state]);

  return { error, userData, navState };
};
