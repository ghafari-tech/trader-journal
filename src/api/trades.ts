import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface Trade {
  id: string | number;
  transaction_id: string;
  mt_ticket?: string | number | null;

  symbol: string;

  transaction_type: "buy" | "sell" | string;

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

export interface TradesResult {
  transactions: Trade[];
}

export interface TradesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TradesResult;
}

function getToken(): string | null {
  return getAccessToken();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message = "خطا در دریافت معاملات";

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object") {
      const errorData = data as Record<string, unknown>;

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (typeof errorData.message === "string") {
        message = errorData.message;
      } else if (typeof errorData.error === "string") {
        message = errorData.error;
      }
    }

    throw new Error(message);
  }

  return data as T;
}

/**
 * دریافت معاملات صفحه مشخص.
 *
 * API:
 * GET /app/trades/?page=1
 * GET /app/trades/?page=2
 * ...
 *
 * بک‌اند خودش پرتفولیوی فعال را تشخیص می‌دهد.
 */
export async function getTrades(
  page = 1,
): Promise<TradesResponse> {
  const token = getToken();

  if (!token) {
    throw new Error(
      "نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.",
    );
  }

  const safePage = Math.max(1, Math.floor(page));

  const response = await fetch(
    `${API_BASE}/app/trades/?page=${safePage}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await parseResponse<unknown>(response);

  /*
   * ساختار فعلی Swagger:
   *
   * {
   *   count: 115,
   *   next: "...?page=2",
   *   previous: null,
   *   results: {
   *     transactions: [...]
   *   }
   * }
   */

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    const responseData = data as Record<string, unknown>;

    const results =
      responseData.results &&
      typeof responseData.results === "object"
        ? (responseData.results as Record<string, unknown>)
        : null;

    const transactions = Array.isArray(
      results?.transactions,
    )
      ? (results?.transactions as Trade[])
      : [];

    return {
      count:
        typeof responseData.count === "number"
          ? responseData.count
          : transactions.length,

      next:
        typeof responseData.next === "string"
          ? responseData.next
          : null,

      previous:
        typeof responseData.previous === "string"
          ? responseData.previous
          : null,

      results: {
        transactions,
      },
    };
  }

  /*
   * پشتیبانی احتیاطی از نسخه‌های قدیمی API
   * اگر بک‌اند به جای pagination مستقیماً آرایه برگرداند.
   */
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: {
        transactions: data as Trade[],
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