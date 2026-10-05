import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface RiskManagement {
  id?: number;
  max_risk: number | string;
  max_loss_daily: number | string;
  max_loss_weekly: number | string;
  max_transaction_daily: number | string;
  max_consecutive_loss: number | string;
  min_r_r: number | string;
  portfolio?: number | string;
}

export interface RiskManagementResponse {
  riskmanage: RiskManagement;
}

export interface UpdateRiskManagementInput {
  max_risk: string;
  max_loss_daily: string;
  max_loss_weekly: string;
  max_transaction_daily: string;
  max_consecutive_loss: string;
  min_r_r: string;
}

function getToken(): string {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "توکن ورود پیدا نشد. لطفاً دوباره وارد حساب شوید.",
    );
  }

  return token;
}

function getErrorMessage(
  data: unknown,
  fallback: string,
): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof (data as { detail?: unknown }).detail === "string"
  ) {
    return (data as { detail: string }).detail;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error?: unknown }).error === "string"
  ) {
    return (data as { error: string }).error;
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return fallback;
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * دریافت تنظیمات مدیریت ریسک پرتفولیوی فعال
 *
 * GET /app/risk/
 */
export async function getRiskManagement(): Promise<RiskManagement> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/app/risk/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await parseResponse(response);

  console.log("GET /app/risk/ response:", data);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در دریافت تنظیمات مدیریت ریسک: ${response.status}`,
      ),
    );
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "riskmanage" in data &&
    typeof (data as { riskmanage?: unknown }).riskmanage === "object" &&
    (data as { riskmanage?: unknown }).riskmanage !== null
  ) {
    return (data as RiskManagementResponse).riskmanage;
  }

  throw new Error(
    "ساختار پاسخ تنظیمات مدیریت ریسک نامعتبر است.",
  );
}

/**
 * ذخیره تنظیمات مدیریت ریسک پرتفولیوی فعال
 *
 * POST /app/risk/update/
 */
export async function updateRiskManagement(
  input: UpdateRiskManagementInput,
): Promise<RiskManagement | null> {
  const token = getToken();

  const body = {
    max_risk: String(input.max_risk),
    max_loss_daily: String(input.max_loss_daily),
    max_loss_weekly: String(input.max_loss_weekly),
    max_transaction_daily: String(input.max_transaction_daily),
    max_consecutive_loss: String(input.max_consecutive_loss),
    min_r_r: String(input.min_r_r),
  };

  const response = await fetch(
    `${API_BASE}/app/risk/update/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  const data = await parseResponse(response);

  console.log("POST /app/risk/update/ response:", data);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در ذخیره تنظیمات مدیریت ریسک: ${response.status}`,
      ),
    );
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "riskmanage" in data &&
    typeof (data as { riskmanage?: unknown }).riskmanage === "object" &&
    (data as { riskmanage?: unknown }).riskmanage !== null
  ) {
    return (data as RiskManagementResponse).riskmanage;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data)
  ) {
    return data as RiskManagement;
  }

  return null;
}