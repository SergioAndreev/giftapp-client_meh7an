import {
  Admin,
  Gift,
  InvoiceUrls,
  PaymentStatus,
  Transaction,
  TransactionListResponse,
  User,
} from "../types/types";
import { getApi } from "./api";
import { ServiceError, withErrorHandling, Logger } from "./errorHandling";
import { ServiceErrorType } from "./errorHandling";

/** API response wrapper interface */
export interface Response<T> {
  success: boolean;
  data: T;
  error: string;
  code: number;
}

export type ApiResponse<T> = Promise<Response<T>>;

export const giftService = {
  /**
   * Fetches all available gifts for the Store page
   * @returns Promise with list of all gifts and their details
   * @throws {ServiceError} If gifts cannot be fetched
   */
  getGifts: (): ApiResponse<{ gifts: Gift[] }> =>
    withErrorHandling("GiftService", "getGifts", () =>
      getApi().get<Response<{ gifts: Gift[] }>>("/gift/list")
    ),

  /**
   * Gets detailed information for a specific gift
   * @param id - Gift identifier
   * @returns Promise with gift details
   * @throws {ServiceError} If gift not found
   */
  getGiftById: (id: string): ApiResponse<Gift> =>
    withErrorHandling("GiftService", "getGiftById", () =>
      getApi().get<Response<Gift>>(`/gift/${id}`)
    ),

  /**
   * Gets paginated transaction history for a specific gift
   * @param giftId - Gift identifier
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @returns Promise with paginated transaction list
   */
  getGiftTransactions: (
    giftId: string,
    page: number = 1,
    limit: number = 10
  ): ApiResponse<TransactionListResponse> =>
    withErrorHandling("GiftService", "getGiftTransactions", () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      return getApi().get<Response<TransactionListResponse>>(
        `/gift/transaction/list/${giftId}?${params}`
      );
    }),
};

export const transactionService = {
  /**
   * Gets all transactions for a specific gift type
   * @param giftSlug - Unique identifier for gift type
   * @returns Promise with list of transactions
   */
  getTransactionsOfGift: (
    giftSlug: string
  ): ApiResponse<{ transactions: Transaction[] }> =>
    withErrorHandling("TransactionService", "getTransactionsOfGift", () =>
      getApi().get<Response<{ transactions: Transaction[] }>>(
        `/transaction/list/${giftSlug}`
      )
    ),

  /**
   * Claims a gift by validating transaction and sender
   * @param id - Transaction identifier
   * @param senderId - Telegram ID of gift sender
   * @returns Promise with transaction details
   * @throws {ServiceError} If transaction invalid or already claimed
   */
  getTransactionById: (
    id: string,
    senderId: number
  ): ApiResponse<Transaction> =>
    withErrorHandling("TransactionService", "getTransactionById", () =>
      getApi().get<Response<Transaction>>(`/transaction/${id}/${senderId}`)
    ),
};

export const userService = {
  /**
   * Fetches user profile with stats and achievements
   * @param telegramId - Telegram user identifier
   * @returns Promise with user profile data
   */
  getUser: (telegramId: number): ApiResponse<User> =>
    withErrorHandling("UserService", "getUser", () =>
      getApi().get<Response<User>>(`/user/profile/${telegramId}`)
    ),

  /**
   * Gets user's gifts with filtering and pagination
   * @param isPending - Filter for pending gifts
   * @param telegramId - Optional user identifier
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with paginated gifts
   */
  getUserGifts: (
    isPending: boolean,
    telegramId?: number,
    page: number = 1,
    limit: number = 9
  ): ApiResponse<{ items: Transaction[]; total: number; hasNext: boolean }> =>
    withErrorHandling("UserService", "getUserGifts", () => {
      const params = new URLSearchParams();
      if (isPending) params.append("status", "pending");
      if (telegramId) params.append("id", telegramId.toString());
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      return getApi().get<
        Response<{ items: Transaction[]; total: number; hasNext: boolean }>
      >(`/user/gift/list?${params}`);
    }),

  /**
   * Gets paginated transaction history for user
   * @param page - Page number for infinite scroll
   * @param limit - Items per page
   * @returns Promise with transaction list
   */
  getUserTransactions: (
    page: number = 1,
    limit: number = 10
  ): ApiResponse<TransactionListResponse> =>
    withErrorHandling("TransactionService", "getUserTransactions", () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      return getApi().get<Response<TransactionListResponse>>(
        `/user/transaction/list?${params}`
      );
    }),
};

export const paymentService = {
  /**
   * Creates payment invoice in CryptoPay
   * @param giftId - Gift to be purchased
   * @returns Promise with payment URLs and invoice details
   * @throws {ServiceError} If invoice creation fails
   */
  createInvoice: (giftId: string): ApiResponse<InvoiceUrls> =>
    withErrorHandling("PaymentService", "createInvoice", () =>
      getApi().post<Response<InvoiceUrls>>(`/invoice/create-invoice/${giftId}`)
    ),

  /**
   * Checks payment status
   * @param invoiceId - CryptoPay invoice identifier
   * @returns Promise with payment status
   */
  getPaymentStatus: (invoiceId: number): ApiResponse<PaymentStatus> =>
    withErrorHandling("PaymentService", "getPaymentStatus", () =>
      getApi().get<Response<PaymentStatus>>(`/invoice/status/${invoiceId}`)
    ),

  /**
   * Verifies if payment is completed
   * @param invoiceId - Invoice to verify
   * @returns Promise resolving to payment completion status
   */
  verifyPurchase: async (invoiceId: number): Promise<boolean> =>
    withErrorHandling("PaymentService", "verifyPurchase", async () => {
      const response = await getApi().get<Response<PaymentStatus>>(
        `/invoice/status/${invoiceId}`
      );
      return response.data.status === "COMPLETED";
    }),

  /**
   * Continuously polls payment status until timeout
   * @param invoiceId - Invoice to monitor
   * @param timeout - Maximum wait time in ms
   * @param interval - Check frequency in ms
   * @returns Promise resolving to final payment status
   */
  pollPaymentStatus: (
    invoiceId: number,
    timeout = 5 * 60 * 1000,
    interval = 5000
  ) => {
    const controller = {
      isCancelled: false,
      timeoutId: undefined as NodeJS.Timeout | undefined,
      cancel() {
        this.isCancelled = true;
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
      },
    };

    const promise = withErrorHandling(
      "PaymentService",
      "pollPaymentStatus",
      () => {
        const startTime = Date.now();

        return new Promise<boolean>((resolve) => {
          const checkStatus = async () => {
            if (controller.isCancelled) {
              resolve(false);
              return;
            }

            if (Date.now() - startTime > timeout) {
              Logger.error(
                new ServiceError(
                  new Error("Payment timeout"),
                  "PaymentService",
                  "pollPaymentStatus",
                  ServiceErrorType.PAYMENT_TIMEOUT,
                  "Payment verification timed out"
                ),
                { invoiceId }
              );
              resolve(false);
              return;
            }

            try {
              const isCompleted = await paymentService.verifyPurchase(
                invoiceId
              );
              if (isCompleted) {
                resolve(true);
                return;
              }
            } catch (error) {
              Logger.error(error as ServiceError, {
                invoiceId,
                attempt: Math.floor((Date.now() - startTime) / interval),
              });
            }

            if (!controller.isCancelled) {
              controller.timeoutId = setTimeout(checkStatus, interval);
            }
          };

          checkStatus();
        });
      }
    );

    return Object.assign(promise, { cancel: () => controller.cancel() });
  },
};

export const leaderboardService = {
  /**
   * Gets ranked users list with search and pagination
   * @param page - Page number
   * @param limit - Users per page
   * @param search - Optional search query
   * @returns Promise with ranked users and pagination info
   */
  getLeaderboard: (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): ApiResponse<{
    users: (User & { rank: number })[];
    hasNext: boolean;
    total: number;
  }> =>
    withErrorHandling("LeaderboardService", "getLeaderboard", () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search: search.trim() }),
      });
      return getApi().get<
        Response<{
          users: (User & { rank: number })[];
          hasNext: boolean;
          total: number;
        }>
      >(`/leaderboard?${params}`);
    }),
};

export const adminService = {
  /**
   * Validates admin privileges
   * @returns Promise with admin status and level
   * @throws {ServiceError} If unauthorized
   */
  getAdminStatus: (): ApiResponse<{
    isAdmin: boolean;
    isSuperAdmin: boolean;
  }> =>
    withErrorHandling("AdminService", "getAdminStatus", () =>
      getApi().get<Response<{ isAdmin: boolean; isSuperAdmin: boolean }>>(
        "/admin/status"
      )
    ),

  /**
   * Creates new gift in store
   * @param data - Gift details and pricing
   * @throws {ServiceError} If creation fails or unauthorized
   */
  addGift: (data: Record<string, string | number>): ApiResponse<void> =>
    withErrorHandling("AdminService", "addGift", () =>
      getApi().post<Response<void>>("/gift/add", data)
    ),

  /**
   * Gets list of all admin users
   * @returns Promise with admin list
   * @throws {ServiceError} If not super admin
   */
  getAdmins: (): ApiResponse<{ admins: Admin[] }> =>
    withErrorHandling("AdminService", "getAdmins", () =>
      getApi().get<Response<{ admins: Admin[] }>>("/admin/list")
    ),

  /**
   * Promotes user to admin role
   * @param data - User details and role
   * @throws {ServiceError} If promotion fails or unauthorized
   */
  addAdmin: (data: Record<string, string | number>): ApiResponse<void> =>
    withErrorHandling("AdminService", "addAdmin", () =>
      getApi().post<Response<void>>("/admin/add", data)
    ),

  /**
   * Removes admin privileges
   * @param telegramID - Admin to demote
   * @throws {ServiceError} If demotion fails or unauthorized
   */
  deleteAdmin: (telegramID: number): ApiResponse<{ message: string }> =>
    withErrorHandling("AdminService", "deleteAdmin", () =>
      getApi().delete<Response<{ message: string }>>(
        `/admin/delete/${telegramID}`
      )
    ),
};
