import { useEffect } from "react";
import { fetchAdmins, fetchAdminGifts } from "@/lib/fetch/admin";
import { Admin, Gift } from "@/types/types";

export default function useLoadData(
  isAdmin: boolean,
  activeTab: string,
  setGifts: (data: Gift[]) => void,
  setAdmins: (data: Admin[]) => void
) {
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === "gifts") {
      fetchAdminGifts(setGifts);
    }

    if (activeTab === "admins") {
      fetchAdmins(setAdmins);
    }
  }, [isAdmin, activeTab]);
}
