import WebApp from "@twa-dev/sdk";
import { animate } from "framer-motion";

export const goToPage = async (
  e: React.MouseEvent<HTMLDivElement>,
  path: string,
  currentPath: string,
  navigate: (path: string) => void
) => {
  e.preventDefault();
  WebApp.HapticFeedback.impactOccurred("light");
  if (path === currentPath) return;
  if (path === "profile") {
    navigate(`/profile/${WebApp.initDataUnsafe.user?.id}`);
    return;
  }

  const button = e.currentTarget;
  if (path === "store") {
    navigate("/");
  } else {
    navigate(`/${path}`);
  }

  // Animate button press down
  await animate(button, { scale: 0.9 }, { duration: 0.15 });
  // Then animate back up
  await animate(button, { scale: 1 }, { duration: 0.15 });
};
