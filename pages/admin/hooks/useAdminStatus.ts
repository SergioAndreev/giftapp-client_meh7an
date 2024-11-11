import { adminService } from "@/lib/services";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
export default function useAdminStatus(
  setIsAdmin: (isAdmin: boolean) => void,
  setIsSuperAdmin: (isSuperAdmin: boolean) => void,
  setIsLoading: (isLoading: boolean) => void
) {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { error, success, data } = await adminService.getAdminStatus();
        if (!success) {
          throw new Error(error);
        }
        const isAdmin = data.isAdmin;
        if (isAdmin) {
          WebApp.SettingsButton.show();
          WebApp.SettingsButton.onClick(() => {
            navigate("/admin");
          });
        }
        const isSuperAdmin = data.isSuperAdmin;
        setIsAdmin(isAdmin);
        setIsSuperAdmin(isSuperAdmin);
      } catch (error) {
        console.error("Failed to fetch admin status:", error);
        setIsAdmin(false);
        setIsSuperAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdminStatus();
  }, []);
}
