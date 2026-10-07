import { apiFetch } from "@/api/client";

export type PaymentRequestPayload = {
  subscription_id: number;
  discount_code?: string;
};

export type PaymentRequestResponse = {
  success: boolean;
  authority: string;
  payment_url: string;
  original_amount: number;
  amount: number;
  discount_amount: number;
};

export type PaymentVerifyResponse = {
  success: boolean;
  code: string;
  message: string;
  ref_id: string;
};

/**
 * ایجاد درخواست پرداخت اشتراک
 */
export async function requestPayment(
  payload: PaymentRequestPayload,
): Promise<PaymentRequestResponse> {
  return apiFetch<PaymentRequestResponse>(
    "/payment/request/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

/**
 * تأیید پرداخت بعد از برگشت از درگاه
 *
 * توجه:
 * طبق Swagger این endpoint پارامتر رسمی ندارد
 * و authority را از callback/payment gateway دریافت می‌کند.
 */
export async function verifyPayment(): Promise<PaymentVerifyResponse> {
  return apiFetch<PaymentVerifyResponse>(
    "/payment/verify/",
  );
}