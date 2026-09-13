import {
  apiFetch,
  API_BASE,
} from "@/api/client";

import {
  clearAuthTokens,
  getAccessToken,
} from "@/lib/auth-storage";

/* =========================================================
   Types
========================================================= */

export type MetaTraderStatus = {
  connected: boolean;
  platform: string | null;
  server: string | null;
  account_number: string | null;
  api_key: string | null;
  last_seen: string | null;
};

/* =========================================================
   Get MetaTrader Status
========================================================= */

export async function getMetaTraderStatus(): Promise<MetaTraderStatus> {
  return apiFetch<MetaTraderStatus>(
    "/app/settings/metatrader/mt-status/",
    {
      method: "GET",
    },
  );
}

/* =========================================================
   Download MetaTrader EA
========================================================= */

export async function downloadMetaTraderEA(): Promise<{
  blob: Blob;
  filename: string;
}> {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "برای دانلود Expert Advisor ابتدا وارد حساب کاربری شوید.",
    );
  }

  const response = await fetch(
    `${API_BASE}/app/settings/metatrader/download-ea/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  /* -------------------------------------------------------
     Unauthorized
  ------------------------------------------------------- */

  if (response.status === 401) {
    clearAuthTokens();

    throw new Error(
      "نشست شما منقضی شده است. لطفاً دوباره وارد حساب شوید.",
    );
  }

  /* -------------------------------------------------------
     Other errors
  ------------------------------------------------------- */

  if (!response.ok) {
    let message =
      "دانلود Expert Advisor انجام نشد.";

    try {
      const contentType =
        response.headers.get("content-type") || "";

      if (
        contentType.includes("application/json")
      ) {
        const data = await response.json();

        if (
          typeof data?.detail === "string"
        ) {
          message = data.detail;
        } else if (
          typeof data?.message === "string"
        ) {
          message = data.message;
        }
      } else {
        const text = await response.text();

        if (text.trim()) {
          message = text;
        }
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  /* -------------------------------------------------------
     Get filename from Content-Disposition
  ------------------------------------------------------- */

  const contentDisposition =
    response.headers.get(
      "content-disposition",
    );

  let filename = "TradeJournalEA.ex5";

  if (contentDisposition) {
    const utf8Match =
      contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/i,
      );

    const normalMatch =
      contentDisposition.match(
        /filename="?([^"]+)"?/i,
      );

    if (utf8Match?.[1]) {
      try {
        filename = decodeURIComponent(
          utf8Match[1],
        );
      } catch {
        filename = utf8Match[1];
      }
    } else if (normalMatch?.[1]) {
      filename = normalMatch[1];
    }
  }

  /* -------------------------------------------------------
     Convert response to Blob
  ------------------------------------------------------- */

  const blob = await response.blob();

  if (!blob.size) {
    throw new Error(
      "فایل Expert Advisor خالی است یا از سمت سرور دریافت نشد.",
    );
  }

  return {
    blob,
    filename,
  };
}