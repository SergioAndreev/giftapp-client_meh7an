import { adminService, giftService } from "../services";
import { Admin, Gift } from "../../types/types";

/**
 * Fetches all admin users and updates state through callback
 *
 * @param setAdmins - State setter callback for admins array
 * @example
 * ```ts
 * const [admins, setAdmins] = useState<Admin[]>([]);
 * await fetchAdmins(setAdmins);
 * ```
 */
export const fetchAdmins = async (setAdmins: (data: Admin[]) => void) => {
  try {
    const { error, success, data } = await adminService.getAdmins();
    if (!success) {
      throw new Error(error);
    }
    const admins = data.admins;
    setAdmins(admins);
  } catch (error) {
    console.error("Failed to fetch admins:", error);
  }
};

/**
 * Adds a new admin user
 *
 * @param data - Admin user data object
 * @returns Object with success status and error message if any
 * @example
 * ```ts
 * const result = await addAdmin({
 *   telegramId: 123456789,
 *   username: "admin_user"
 * });
 * if (!result.success) console.error(result.error);
 * ```
 */
export const addAdmin = async (
  data: Record<string, string | number>
): Promise<{ error: string; success: boolean }> => {
  try {
    const { error, success } = await adminService.addAdmin(data);
    return { success, error };
  } catch (error) {
    return { success: false, error: "Failed to add admin: " + error };
  }
};

/**
 * Deletes an admin user by their Telegram ID
 *
 * @param telegramID - Telegram ID of admin to delete
 * @returns Service response data if successful
 * @example
 * ```ts
 * await deleteAdmin(123456789);
 * ```
 */
export const deleteAdmin = async (telegramID: number): Promise<unknown> => {
  try {
    const { error, success, data } = await adminService.deleteAdmin(telegramID);
    if (!success) {
      throw new Error(error);
    }
    return data;
  } catch (error) {
    console.error("Failed to delete admin:", error);
  }
};

/**
 * Fetches all gifts for admins and updates state through callback
 *
 * @param setGifts - State setter callback for gifts array
 * @example
 * ```ts
 * const [gifts, setGifts] = useState<Gift[]>([]);
 * await fetchAdminGifts(setGifts);
 * ```
 */
export const fetchAdminGifts = async (setGifts: (data: Gift[]) => void) => {
  try {
    const { error, success, data } = await giftService.getGifts();
    if (!success) {
      throw new Error(error);
    }
    setGifts(data.gifts);
  } catch (error) {
    console.error("Failed to fetch gifts:", error);
  }
};

/**
 * Adds a new gift to the system
 *
 * @param data - Gift data object
 * @returns Object with success status and error message if any
 * @example
 * ```ts
 * const result = await addGift({
 *   name: "Premium Gift",
 *   price: 100,
 *   description: "Premium gift it is."
 * });
 * if (!result.success) console.error(result.error);
 * ```
 */
export const addGift = async (
  data: Record<string, string | number>
): Promise<{ error: string; success: boolean }> => {
  try {
    const { error, success } = await adminService.addGift(data);
    return { success, error };
  } catch (error) {
    return { success: false, error: "Failed to add gift: " + error };
  }
};
