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
  risk_reward: string | number;
  profit_loss: string | number;
  followed_plan: boolean;
  r_r: string | number;
  created_at: string;
  closed_at: string | null;
  portfolio: string | number;
}

interface TradesResponse {
  transactions: Trade[];
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

export async function getTrades(
  portfolioId: string | number,
): Promise<Trade[]> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/app/trades/?portfolio_id=${encodeURIComponent(
      String(portfolioId),
    )}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const data = await parseResponse<TradesResponse | Trade[]>(response);

  if (Array.isArray(data)) {
    return data;
  }

  return Array.isArray(data.transactions) ? data.transactions : [];
}