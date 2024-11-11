import { SenderUserProps } from "../../GiftCard/types/giftCard.types";

export interface TableData {
  [key: string]: string | "string" | "number" | "number+0" | `file:${string}`;
}

export interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerImage: string | false;
  title: string;
  table: TableData;
  currency?: string;
  sender?: SenderUserProps;
  buttonText: string;
  feedback?: (
    data: Record<string, string | number>
  ) => Promise<{ error: string; success: boolean }>;
  refresher?: () => void;
}
