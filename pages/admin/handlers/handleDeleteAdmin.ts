import { deleteAdmin, fetchAdmins } from "@/lib/fetch/admin";
import { Admin } from "@/types/types";
import WebApp from "@twa-dev/sdk";
import { Dispatch, SetStateAction } from "react";

export const handleDeleteAdmin = async (
  telegramID: number,
  setAdmins: Dispatch<SetStateAction<Admin[]>>
) => {
  WebApp.showConfirm(
    "Are you sure you want to delete this admin?",
    async (confirmed) => {
      if (confirmed) {
        const data = (await deleteAdmin(telegramID)) as { message: string };
        WebApp.showPopup({
          title: "Success",
          message: data.message,
        });
        await fetchAdmins(setAdmins);
      }
    }
  );
};
