
import { apiFetch } from "@/api/client";

export interface RiskManagement {
  id?: number;
  max_risk: number | string;
  max_loss_daily: number | string;
  max_loss_weekly: number | string;
  max_transaction_daily: number | string;
  max_consecutive_loss: number | string;
  min_r_r: number | string;
  portfolio?: number | string | null;
}

export interface RiskUsage {
  max_risk_in_trade: number;
  max_risk_in_day: number;
  max_risk_in_week: number;
  max_transaction_in_day: number;
  max_consecutive_loss: number;
  min_r_r: number;
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

interface UpdateRiskManagementResponse {
  message?: string;
  riskmanage?: RiskManagement;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNumericValue(value: unknown): boolean {
  return (
    (typeof value === "number" || typeof value === "string") &&
    String(value).trim() !== "" &&
    Number.isFinite(Number(value))
  );
}

function isRiskManagement(value: unknown): value is RiskManagement {
  if (!isRecord(value)) return false;

  const fields: (keyof UpdateRiskManagementInput)[] = [
    "max_risk",
    "max_loss_daily",
    "max_loss_weekly",
    "max_transaction_daily",
    "max_consecutive_loss",
    "min_r_r",
  ];

  return fields.every((field) => isNumericValue(value[field]));
}

function isRiskUsage(value: unknown): value is RiskUsage {
  if (!isRecord(value)) return false;

  const fields: (keyof RiskUsage)[] = [
    "max_risk_in_trade",
    "max_risk_in_day",
    "max_risk_in_week",
    "max_transaction_in_day",
    "max_consecutive_loss",
    "min_r_r",
  ];

  return fields.every((field) => isNumericValue(value[field]));
}

/**
 * دریافت قوانین ذخیره‌شده مدیریت ریسک.
 * GET /app/risk/
 */
export async function getRiskManagement(): Promise<RiskManagement> {
  const data = await apiFetch<RiskManagementResponse>("/app/risk/", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!isRecord(data) || !isRiskManagement(data.riskmanage)) {
    throw new Error("ساختار پاسخ تنظیمات مدیریت ریسک نامعتبر است.");
  }

  return data.riskmanage;
}

/**
 * دریافت شاخص‌های محاسبه‌شده مدیریت ریسک.
 * GET /app/risk/look/
 */
export async function getRiskUsage(): Promise<RiskUsage> {
  const data = await apiFetch<unknown>("/app/risk/look/", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!isRiskUsage(data)) {
    throw new Error(
      "ساختار پاسخ آمار مدیریت ریسک نامعتبر است.",
    );
  }

  return {
    max_risk_in_trade: Number(data.max_risk_in_trade),
    max_risk_in_day: Number(data.max_risk_in_day),
    max_risk_in_week: Number(data.max_risk_in_week),
    max_transaction_in_day: Number(data.max_transaction_in_day),
    max_consecutive_loss: Number(data.max_consecutive_loss),
    min_r_r: Number(data.min_r_r),
  };
}

/**
 * ذخیره قوانین مدیریت ریسک.
 * POST /app/risk/update/
 */
export async function updateRiskManagement(
  input: UpdateRiskManagementInput,
): Promise<RiskManagement | null> {
  const body: UpdateRiskManagementInput = {
    max_risk: String(input.max_risk),
    max_loss_daily: String(input.max_loss_daily),
    max_loss_weekly: String(input.max_loss_weekly),
    max_transaction_daily: String(input.max_transaction_daily),
    max_consecutive_loss: String(input.max_consecutive_loss),
    min_r_r: String(input.min_r_r),
  };

  const data = await apiFetch<UpdateRiskManagementResponse>(
    "/app/risk/update/",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (isRecord(data) && isRiskManagement(data.riskmanage)) {
    return data.riskmanage;
  }

  return null;
}
