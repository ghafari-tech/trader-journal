import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface CalendarDay {
  date: string;
  transactions_count: number;
  profit_loss: number;
}

export interface CalendarResponse {
  total_month: number;
  profitable_days: number;
  loss_days: number;
  best_day: number;
  calendar: CalendarDay[];
}

function getToken() {
  return getAccessToken();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message = "خطا در دریافت تقویم معاملاتی";

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

export async function getCalendar(): Promise<CalendarResponse> {
  const token = getToken();

  const response = await fetch(`${API_BASE}/app/trades/calendar/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseResponse<CalendarResponse>(response);

  return {
    total_month: Number(data?.total_month ?? 0),
    profitable_days: Number(data?.profitable_days ?? 0),
    loss_days: Number(data?.loss_days ?? 0),
    best_day: Number(data?.best_day ?? 0),
    calendar: Array.isArray(data?.calendar)
      ? data.calendar.map((day) => ({
          date: String(day.date ?? ""),
          transactions_count: Number(day.transactions_count ?? 0),
          profit_loss: Number(day.profit_loss ?? 0),
        }))
      : [],
  };
}