import { DynamicModalProps } from "@/components/ui/Modal/types/modal.types";
import { addGift } from "@/lib/fetch/admin";
import { fetchGifts } from "@/lib/fetch/gifts";
import { Gift } from "@/types/types";

export const handleAddGift = (
  openModal: (props: DynamicModalProps) => void,
  setGifts: React.Dispatch<React.SetStateAction<Gift[]>>
) => {
  openModal({
    isOpen: true,
    onClose: () => {},
    title: "Add New Gift",
    table: {
      Name: "string",
      Price: "number+0",
      Currency: "string",
      TotalAvailable: "number+0",
      Color: "string",
      PatternID: "string",
      LottieID: "string",
    },
    buttonText: "Add Gift",
    feedback: addGift,
    headerImage: false,
    refresher: () => fetchGifts(setGifts),
  });
};
