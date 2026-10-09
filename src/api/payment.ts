
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
  const response = await apiFetch<PaymentRequestResponse>(
    "/payment/request/",
    {
      method: "POST",
      body: JSON.stringify({
        subscription_id: payload.subscription_id,
        ...(payload.discount_code?.trim()
          ? { discount_code: payload.discount_code.trim() }
          : {}),
      }),
    },
  );

  if (!response?.success || !response.payment_url) {
    throw new Error("ایجاد درخواست پرداخت ناموفق بود.");
  }

  return response;
}

/**
 * تأیید پرداخت پس از بازگشت از درگاه
 *
 * طبق قرارداد فعلی API، endpoint پارامتر رسمی دریافت نمی‌کند.
 * نتیجه نهایی پرداخت باید از پاسخ بک‌اند بررسی شود.
 */
export async function verifyPayment(): Promise<PaymentVerifyResponse> {
  const response = await apiFetch<PaymentVerifyResponse>(
    "/payment/verify/",
    {
      method: "GET",
    },
  );

  if (!response || typeof response.success !== "boolean") {
    throw new Error("پاسخ تأیید پرداخت از سرور معتبر نیست.");
  }

  return response;
}

