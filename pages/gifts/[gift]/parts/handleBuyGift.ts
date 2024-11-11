import { initiatePayment } from "@/lib/fetch/invoice";
import { Gift } from "@/types/types";
import { useNavigate } from "react-router-dom";

export const handleBuyGift = async (
  giftData: Gift,
  cleanupRef: React.MutableRefObject<(() => void) | undefined>,
  navigate: ReturnType<typeof useNavigate>
) => {
  if (cleanupRef.current) {
    cleanupRef.current();
  }

  const result = await initiatePayment(
    giftData.id,
    () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
      navigate("/successful", { state: giftData });
    },
    (error) => {
      console.error("Payment failed:", error);
    }
  );
  if (result?.cleanup) {
    cleanupRef.current = result.cleanup;
  }
};
