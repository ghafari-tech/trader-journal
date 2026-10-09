
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
  swap?: string | number | null;
  commission?: string | number | null;
  risk_reward: string | number;
  profit_loss: string | number;
  followed_plan: boolean;
  r_r: string | number;
  created_at: string;
  closed_at: string | null;
  portfolio: string | number;
}

export function getNetProfitLoss(trade: Trade): number {
  const grossProfit =
    typeof trade.profit_loss === "number"
      ? trade.profit_loss
      : parseFloat(String(trade.profit_loss || 0));
  const swap =
    typeof trade.swap === "number"
      ? trade.swap
      : parseFloat(String(trade.swap || 0));
  const commission =
    typeof trade.commission === "number"
      ? trade.commission
      : parseFloat(String(trade.commission || 0));

  const safeGross = isNaN(grossProfit) ? 0 : grossProfit;
  const safeSwap = isNaN(swap) ? 0 : swap;
  const safeCommission = isNaN(commission) ? 0 : commission;

  return safeGross + safeSwap + safeCommission;
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

export interface CreateTradePayload {
  symbol: string;
  transaction_type: string;
  entry_price: string | number;
  exit_price?: string | number;
  stop_loss?: string | number;
  take_profit?: string | number;
  volume: string | number;
  risk_percent?: string | number;
  commission?: string | number;
  swap?: string | number;
  notes?: string;
  entry_reason?: string;
  exit_reason?: string;
  emotion_before?: string;
  emotion_after?: string;
  followed_plan?: boolean;
  mistakes?: string;
  lessons?: string;
  chart_image?: File | null;
}

function getToken(): string | null {
  return getAccessToken();
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const contentType =
    response.headers.get("content-type") ?? "";

  const data =
    contentType.includes("application/json")
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    let message = "خطا در برقراری ارتباط با سرور";

    if (
      typeof data === "string" &&
      data.trim()
    ) {
      message = data;
    } else if (
      data &&
      typeof data === "object"
    ) {
      const errorData =
        data as Record<string, unknown>;

      if (
        typeof errorData.detail === "string"
      ) {
        message = errorData.detail;
      } else if (
        typeof errorData.message === "string"
      ) {
        message = errorData.message;
      } else if (
        typeof errorData.error === "string"
      ) {
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
 * ساختار فعلی API:
 *
 * {
 *   "count": 131,
 *   "next": "...?page=2",
 *   "previous": null,
 *   "transactions": [...]
 * }
 *
 * همچنین ساختار قدیمی زیر نیز پشتیبانی می‌شود:
 *
 * {
 *   "count": 131,
 *   "next": "...?page=2",
 *   "previous": null,
 *   "results": {
 *     "transactions": [...]
 *   }
 * }
 *
 * بک‌اند خودش پرتفولیوی فعال را تشخیص می‌دهد.
 */
export async function getTrades(
  page = 1,
): Promise<TradesResponse> {
  const token = getToken();

  if (!token) {
    throw new Error("نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.");
  }

  const safePage = Math.max(
    1,
    Math.floor(page),
  );

  const response = await fetch(`${API_BASE}/app/trades/?page=${safePage}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse<unknown>(
    response,
  );

  /*
   * ساختار JSON فعلی API:
   *
   * {
   *   count: 131,
   *   next: "...",
   *   previous: null,
   *   transactions: [...]
   * }
   */

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    const responseData =
      data as Record<string, unknown>;

    /*
     * اول ساختار فعلی API را بررسی می‌کنیم:
     *
     * response.transactions
     */
    const directTransactions =
      Array.isArray(
        responseData.transactions,
      )
        ? (responseData.transactions as Trade[])
        : null;

    /*
     * سپس ساختار قدیمی API را بررسی می‌کنیم:
     *
     * response.results.transactions
     */
    const results =
      responseData.results &&
      typeof responseData.results === "object"
        ? (responseData.results as Record<
            string,
            unknown
          >)
        : null;

    const nestedTransactions =
      Array.isArray(
        results?.transactions,
      )
        ? (results.transactions as Trade[])
        : null;

    /*
     * اگر ساختار فعلی وجود داشت،
     * همان را استفاده می‌کنیم.
     *
     * در غیر این صورت ساختار قدیمی.
     */
    const transactions =
      directTransactions ??
      nestedTransactions ??
      [];

    return {
      count:
        typeof responseData.count ===
        "number"
          ? responseData.count
          : transactions.length,
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
        transactions,
      },
    };
  }

  /*
   * پgit statusشتیبانی احتیاطی از نسخه‌های قدیمی API
   * اگر بک‌اند مستقیماً آرایه برگرداند.
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

  /*
   * اگر پاسخ API ساختار شناخته‌شده‌ای نداشت،
   * یک پاسخ خالی و معتبر برمی‌گردانیم.
   */
  return {
    count: 0,
    next: null,
    previous: null,
    results: {
      transactions: [],
    },
  };
}

/**
 * ثبت یک معامله جدید.
 *
 * چون ممکن است تصویر چارت (chart_image) هم ارسال شود،
 * از FormData استفاده می‌کنیم تا هر دو نوع داده متنی و فایل
 * در یک درخواست multipart/form-data ارسال شوند.
 *
 * API:
 * POST /app/trades/add/
 */
export async function createTrade(
  payload: CreateTradePayload,
): Promise<Trade> {
  const token = getToken();

  if (!token) {
    throw new Error("نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.");
  }

  const formData = new FormData();

  /*
   * فقط فیلدهای غیرخالی را ارسال می‌کنیم تا از خطای
   * اعتبارسنجی سمت سرور جلوگیری شود.
   */
  const appendIfPresent = (
    key: string,
    value: string | number | boolean | null | undefined,
  ) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    formData.append(key, String(value));
  };

  appendIfPresent("symbol", payload.symbol);
  appendIfPresent("transaction_type", payload.transaction_type);
  appendIfPresent("entry_price", payload.entry_price);
  appendIfPresent("exit_price", payload.exit_price);
  appendIfPresent("stop_loss", payload.stop_loss);
  appendIfPresent("take_profit", payload.take_profit);
  appendIfPresent("volume", payload.volume);
  appendIfPresent("risk_percent", payload.risk_percent);
  appendIfPresent("commission", payload.commission);
  appendIfPresent("swap", payload.swap);
  appendIfPresent("notes", payload.notes);
  appendIfPresent("entry_reason", payload.entry_reason);
  appendIfPresent("exit_reason", payload.exit_reason);
  appendIfPresent("emotion_before", payload.emotion_before);
  appendIfPresent("emotion_after", payload.emotion_after);
  appendIfPresent("mistakes", payload.mistakes);
  appendIfPresent("lessons", payload.lessons);

  if (payload.followed_plan !== undefined) {
    formData.append("followed_plan", payload.followed_plan ? "true" : "false");
  }

  if (payload.chart_image) {
    formData.append("chart_image", payload.chart_image);
  }

  const response = await fetch(`${API_BASE}/app/trades/add/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await parseResponse<Trade>(response);

  return data;
}
