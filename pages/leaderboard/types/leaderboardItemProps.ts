import { User } from "@/types/types";

export interface LeaderboardItemProps {
  user: User;
  rank: (index?: number) => JSX.Element;
  isLast?: boolean;
}
