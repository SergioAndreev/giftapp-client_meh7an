import { transactionService } from "@/lib/services";
import WebApp from "@twa-dev/sdk";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook that handles navigation based on Telegram Mini App start parameters.
 * It processes the start_param from WebApp.initDataUnsafe to navigate to the successful
 * gift transaction page when appropriate.
 *
 * The start_param is expected to be in the format: "transactionId-senderId"
 * where:
 * - transactionId: A 24-character string containing only alphanumeric characters, underscores, and hyphens
 * - senderId: An integer representing the sender's Telegram ID
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useStartParamNavigation();
 *   return <div>My Component</div>;
 * }
 * ```
 *
 * @returns void
 */
export const useStartParamNavigation = () => {
  const navigate = useNavigate();
  const hasProcessedStartParam = useRef(false);

  useEffect(() => {
    const checkStartParam = async () => {
      if (hasProcessedStartParam.current) {
        return;
      }
      if (!WebApp?.initDataUnsafe) {
        return;
      }
      const { start_param } = WebApp.initDataUnsafe;
      if (!start_param) {
        return;
      }
      try {
        hasProcessedStartParam.current = true;

        const transactionId = start_param.split("-")[0];
        const senderId = parseInt(start_param.split("-")[1]);

        if (!transactionId || !senderId) {
          return;
        }

        const { error, success, data } =
          await transactionService.getTransactionById(transactionId, senderId);

        if (!success) {
          console.error("Failed to fetch transaction:", error);
          return;
        }
        const transaction = data;
        if (
          transaction &&
          transactionId.length === 24 &&
          /^[a-zA-Z0-9_-]+$/.test(transactionId)
        ) {
          navigate(`/successful`, {
            state: {
              ...transaction.gift,
              sender: transaction.sender,
              receiver: transaction.receiver,
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      }
    };

    if (WebApp) {
      WebApp.ready();
      checkStartParam();
    }
  }, [navigate]);
};
