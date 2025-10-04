import { ApiResponseType } from "@/types/types";
import { ApiResponse } from "@/utils/api.utils";
import axiosInstance from "@/utils/axios";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  stripe_price_id: string;
  features: string[];
}

export interface SubscriptionInfo {
  is_pro: boolean;
  subscription_type: "free" | "pro";
  status: string;
  expires_at: string | null;
  will_cancel: boolean;
  question_access: {
    can_access_pro_questions: boolean;
    available_free_questions: number;
    available_pro_questions: number;
    total_questions: number;
  };
}

export interface Invoice {
  id: string;
  series: string;
  number: string;
  identifier: string;
  amount: number;
  currency: string;
  date: string;
  amount_formatted: string;
  stripe_invoice_id: string;
  status_text: string;
}

/**
 * Get available subscription plans
 */
export const getSubscriptionPlansRequest =
  async (): Promise<ApiResponseType> => {
    try {
      const response = await axiosInstance.post(
        "/subscription/get-subscription-plans"
      );
      return ApiResponse.success(response.data);
    } catch (error) {
      return ApiResponse.error(error);
    }
  };

/**
 * Get current subscription status
 */
export const getSubscriptionStatusRequest =
  async (): Promise<ApiResponseType> => {
    try {
      const response = await axiosInstance.get(
        "/subscription/get-subscription-status"
      );
      return ApiResponse.success(response.data);
    } catch (error) {
      return ApiResponse.error(error);
    }
  };

/**
 * Create checkout session for subscription
 */
export const createCheckoutSessionRequest =
  async (): Promise<ApiResponseType> => {
    try {
      const response = await axiosInstance.post(
        "/subscription/create-checkout-session"
      );
      return ApiResponse.success(response.data);
    } catch (error) {
      return ApiResponse.error(error);
    }
  };

/**
 * Cancel subscription
 */
export const cancelSubscriptionRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/subscription/cancel-subscription"
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Resume subscription
 */
export const resumeSubscriptionRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/subscription/resume-subscription"
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Get SmartBill invoices/billing history
 */
export const getInvoicesRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/subscription/get-smartbill-invoices"
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Download SmartBill invoice PDF
 */
export const downloadInvoiceRequest = async (
  invoiceId: string
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/subscription/download-smartbill-invoice",
      {
        invoice_id: invoiceId,
      },
      {
        responseType: "blob", // Important for PDF download
      }
    );

    // Create blob URL for PDF download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `factura_${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL
    window.URL.revokeObjectURL(url);

    return ApiResponse.success({
      message: "Factura a fost descărcată cu succes",
    });
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Update payment method (redirect to billing portal)
 */
export const updatePaymentMethodRequest =
  async (): Promise<ApiResponseType> => {
    try {
      const response = await axiosInstance.post(
        "/subscription/update-payment-method"
      );
      return ApiResponse.success(response.data);
    } catch (error) {
      return ApiResponse.error(error);
    }
  };

/**
 * Handle checkout success
 */
export const checkoutSuccessRequest = async (
  sessionId: string
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/subscription/checkout-success",
      {
        session_id: sessionId,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Handle checkout cancel
 */
export const checkoutCancelRequest = async (): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post("/subscription/checkout-cancel");
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

/**
 * Check access to specific question
 */
export const checkQuestionAccessRequest = async (
  questionId: number
): Promise<ApiResponseType> => {
  try {
    const response = await axiosInstance.post(
      "/subscription/check-question-access",
      {
        question_id: questionId,
      }
    );
    return ApiResponse.success(response.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
