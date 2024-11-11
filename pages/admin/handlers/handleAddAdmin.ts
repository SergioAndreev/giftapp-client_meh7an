import { DynamicModalProps } from "@/components/ui/Modal/types/modal.types";
import { addAdmin, fetchAdmins } from "@/lib/fetch/admin";
import { Admin } from "@/types/types";

export const handleAddAdmin = (
  openModal: (props: DynamicModalProps) => void,
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>
) => {
  openModal({
    isOpen: true,
    onClose: () => {},
    title: "Add New Admin",
    table: {
      Name: "string",
      TelegramId: "number+0",
    },
    buttonText: "Add Admin",
    feedback: addAdmin,
    headerImage: false,
    refresher: () => fetchAdmins(setAdmins),
  });
};
