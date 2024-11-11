import WebApp from "@twa-dev/sdk";
import { paymentService } from "../services";
import { InvoiceUrls, PaymentStatus } from "../../types/types";

/**
 * Creates a payment invoice for a gift and starts polling for payment completion
 *
 * @param giftId - The ID of the gift to create an invoice for
 * @param onSuccess - Optional callback function to execute when payment is completed
 * @param onError - Optional callback function to handle errors
 * @returns {Promise<InvoiceUrls | null>} Object containing payment URLs or null if creation fails
 * @throws {Error} When invoice creation fails or returns no data
 * @example
 * ```ts
 * const invoice = await createGiftInvoice(
 *   'gift-123',
 *   () => console.log('Payment completed!'),
 *   (error) => console.error('Payment failed:', error)
 * );
 * if (invoice) {
 *   // Use invoice URLs
 * }
 * ```
 */
export const createGiftInvoice = async (
  giftId: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<(InvoiceUrls & { cleanup: () => void }) | null> => {
  try {
    const { error, success, data } = await paymentService.createInvoice(giftId);
    if (!success || !data) {
      throw new Error(error);
    }
    const pollingPromise = paymentService.pollPaymentStatus(data.paymentId);
    pollingPromise.then((completed) => {
      if (completed && onSuccess) {
        onSuccess();
      }
    });

    return {
      paymentId: data.paymentId,
      miniAppUrl: data.miniAppUrl,
      paymentUrl: data.paymentUrl,
      webAppUrl: data.webAppUrl,
      cleanup: () => pollingPromise.cancel(),
    };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    if (onError) {
      onError(
        error instanceof Error ? error.message : "Failed to create invoice"
      );
    }
    return null;
  }
};

/**
 * Fetches the current status of a payment and updates state via callback
 *
 * @param invoiceId - The ID of the invoice to check status for
 * @param setStatus - State setter callback function to update payment status in the UI
 * @throws {Error} When status fetch fails
 * @example
 * ```ts
 * const [status, setStatus] = useState<PaymentStatus | null>(null);
 * await fetchPaymentStatus(12345, setStatus);
 * ```
 */
export const fetchPaymentStatus = async (
  invoiceId: number,
  setStatus: (status: PaymentStatus) => void
) => {
  try {
    const { error, success, data } = await paymentService.getPaymentStatus(
      invoiceId
    );
    if (!success) {
      throw new Error(error);
    }
    setStatus(data);
  } catch (error) {
    console.error("Failed to fetch payment status:", error);
  }
};

/**
 * Creates an invoice and opens the payment URL in Telegram Mini App
 *
 * @param giftId - The ID of the gift to initiate payment for
 * @param onSuccess - Optional callback function to execute when payment is completed
 * @param onError - Optional callback function to handle errors
 * @returns {Promise<string | null>} Payment ID if successful, null otherwise
 * @throws {Error} When invoice creation fails or URL is missing
 * @example
 * ```ts
 * const paymentId = await initiatePayment(
 *   'gift-123',
 *   () => console.log('Payment completed!'),
 *   (error) => console.error('Payment failed:', error)
 * );
 * if (paymentId) {
 *   // Payment initiated successfully
 * }
 * ```
 */
export const initiatePayment = async (
  giftId: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<{ paymentId: number; cleanup: () => void } | null> => {
  try {
    const result = await createGiftInvoice(giftId, onSuccess, onError);
    if (!result) {
      throw new Error("Failed to create invoice");
    }

    const { miniAppUrl } = result;
    if (!miniAppUrl) {
      throw new Error("Failed to create invoice");
    }

    // Open the invoice in Telegram Mini App
    WebApp.openTelegramLink(miniAppUrl);
    return { paymentId: result.paymentId, cleanup: result.cleanup };
  } catch (error) {
    console.error("Failed to initiate payment:", error);
    if (onError) {
      onError(
        error instanceof Error ? error.message : "Failed to initiate payment"
      );
    }
    return null;
  }
};
