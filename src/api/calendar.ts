import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface CalendarDay {
  date: string;
  transactions_count: number;
  profit_loss: number | string;
}

export interface CalendarResponse {
  year: number;
  month: number;
  total_month: number | string;
  profitable_days: number | string;
  loss_days: number | string;
  best_day: number | string;
  calendar: CalendarDay[];
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
    let message =
      "خطا در دریافت تقویم معاملاتی";

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
        typeof errorData.detail ===
        "string"
      ) {
        message = errorData.detail;
      } else if (
        typeof errorData.message ===
        "string"
      ) {
        message = errorData.message;
      } else if (
        typeof errorData.error ===
        "string"
      ) {
        message = errorData.error;
      }
    }

    throw new Error(message);
  }

  return data as T;
}

/**
 * دریافت تقویم معاملات یک ماه.
 *
 * API:
 * GET /app/trades/trades/calendar/{year}/{month}/
 *
 * مثال:
 * /app/trades/trades/calendar/2026/9/
 */
export async function getCalendar(
  year: number,
  month: number,
): Promise<CalendarResponse> {
  const token = getToken();

  if (!token) {
    throw new Error(
      "نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.",
    );
  }

  if (
    !Number.isInteger(year) ||
    year < 2000
  ) {
    throw new Error(
      "سال انتخاب‌شده معتبر نیست.",
    );
  }

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(
      "ماه انتخاب‌شده معتبر نیست.",
    );
  }

  const response = await fetch(
    `${API_BASE}/app/trades/trades/calendar/${year}/${month}/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data =
    await parseResponse<CalendarResponse>(
      response,
    );

  return {
    year: data.year ?? year,
    month: data.month ?? month,
    total_month:
      data.total_month ?? 0,
    profitable_days:
      data.profitable_days ?? 0,
    loss_days:
      data.loss_days ?? 0,
    best_day: data.best_day ?? 0,
    calendar: Array.isArray(
      data.calendar,
    )
      ? data.calendar
      : [],
  };
}