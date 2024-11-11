import { User } from "@/types/types";

export type NavigationState = {
  from: string;
  isMe: boolean;
  imageLayoutId: string;
  userDataFromState?: User;
};
