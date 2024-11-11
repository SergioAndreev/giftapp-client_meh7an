import WebApp from "@twa-dev/sdk";
import { State } from "../types";
import { User } from "@/types/types";

export const successStateCalc = (
  sender: User | null | undefined,
  receiver: User | null | undefined
) => {
  if (sender?.telegramId && !receiver?.telegramId) {
    if (WebApp.initDataUnsafe.user?.id === sender.telegramId) {
      return State.SELF_RECEIVED;
    }
    return State.RECEIVED;
  } else if (sender?.telegramId && receiver?.telegramId) {
    return State.ALREADY_RECEIVED;
  } else if (!sender?.telegramId) {
    return State.PURCHASED;
  }
  return State.PURCHASED;
};
