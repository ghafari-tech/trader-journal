import {
  clearAuthTokens,
  getAccessToken,
} from "@/lib/auth-storage";

import { API_BASE } from "@/api/client";

/* =========================================================
   Types
========================================================= */

export interface Trade {
  id: string | number;

  transaction_id: string;

  mt_ticket?: string | number | null;

  symbol: string;

  transaction_type:
    | "buy"
    | "sell"
    | string;

  entry_price: string | number;

  exit_price: string | number;

  volume: string | number;

  stop_loss?: string | number | null;

  take_profit?: string | number | null;

  risk_reward: string | number;

  profit_loss: string | number;

  followed_plan: boolean;

  r_r: string | number;

  created_at: string;

  closed_at: string | null;

  portfolio: string | number;
}

export interface TradesResponse {
  count: number;

  next: string | null;

  previous: string | null;

  results: {
    transactions: Trade[];
  };
}

/* =========================================================
   Helpers
========================================================= */

function getToken(): string {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.",
    );
  }

  return token;
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  const contentType =
    response.headers.get(
      "content-type",
    ) ?? "";

  const text =
    await response.text();

  if (!text) {
    return null;
  }

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(
  data: unknown,
  fallback: string,
): string {
  if (
    typeof data === "object" &&
    data !== null
  ) {
    const errorData =
      data as Record<
        string,
        unknown
      >;

    if (
      typeof errorData.detail ===
      "string"
    ) {
      return errorData.detail;
    }

    if (
      typeof errorData.message ===
      "string"
    ) {
      return errorData.message;
    }

    if (
      typeof errorData.error ===
      "string"
    ) {
      return errorData.error;
    }
  }

  if (
    typeof data === "string" &&
    data.trim()
  ) {
    return data;
  }

  return fallback;
}

/* =========================================================
   GET Trades
========================================================= */

/**
 * دریافت معاملات پرتفولیوی فعال
 *
 * Backend:
 * GET /app/trades/?page=1
 *
 * بک‌اند خودش پرتفولیوی فعال کاربر را
 * تشخیص می‌دهد.
 */
export async function getTrades(
  page = 1,
): Promise<TradesResponse> {
  const token = getToken();

  const safePage = Math.max(
    1,
    Math.floor(page),
  );

  const response =
    await fetch(
      `${API_BASE}/app/trades/?page=${safePage}`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  const data =
    await parseResponse(
      response,
    );

  if (!response.ok) {
    if (
      response.status === 401
    ) {
      clearAuthTokens();
    }

    throw new Error(
      getErrorMessage(
        data,
        `خطا در دریافت معاملات: ${response.status}`,
      ),
    );
  }

  /*
   * پاسخ فعلی API:
   *
   * {
   *   count: 115,
   *   next: "...",
   *   previous: null,
   *   results: {
   *     transactions: [...]
   *   }
   * }
   */

  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data)
  ) {
    const responseData =
      data as Record<
        string,
        unknown
      >;

    const results =
      responseData.results;

    if (
      typeof results ===
        "object" &&
      results !== null
    ) {
      const resultsData =
        results as Record<
          string,
          unknown
        >;

      return {
        count:
          typeof responseData.count ===
          "number"
            ? responseData.count
            : 0,

        next:
          typeof responseData.next ===
          "string"
            ? responseData.next
            : null,

        previous:
          typeof responseData.previous ===
          "string"
            ? responseData.previous
            : null,

        results: {
          transactions:
            Array.isArray(
              resultsData.transactions,
            )
              ? (resultsData.transactions as Trade[])
              : [],
        },
      };
    }

    /*
     * برای سازگاری با پاسخ قدیمی:
     *
     * {
     *   transactions: [...]
     * }
     */
    if (
      Array.isArray(
        responseData.transactions,
      )
    ) {
      const transactions =
        responseData.transactions as Trade[];

      return {
        count:
          transactions.length,

        next: null,

        previous: null,

        results: {
          transactions,
        },
      };
    }
  }

  /*
   * اگر API مستقیماً آرایه برگرداند.
   */
  if (
    Array.isArray(data)
  ) {
    return {
      count: data.length,

      next: null,

      previous: null,

      results: {
        transactions:
          data as Trade[],
      },
    };
  }

  return {
    count: 0,

    next: null,

    previous: null,

    results: {
      transactions: [],
    },
  };
}