
import { createFileRoute } from "@tanstack/react-router";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getRiskManagement,
  getRiskUsage,
  updateRiskManagement,
  type RiskManagement,
  type RiskUsage,
  type UpdateRiskManagementInput,
} from "@/api/risk";
import { toast } from "sonner";

export const Route = createFileRoute("/app/risk")({
  head: () => ({
    meta: [{ title: "مدیریت ریسک" }],
  }),
  component: RiskPage,
});

const ACTIVE_PORTFOLIO_STORAGE_KEY = "traderjournal-active-portfolio";
const ACTIVE_PORTFOLIO_CHANGED_EVENT =
  "traderjournal-active-portfolio-changed";

interface RiskFormState {
  max_risk: string;
  max_loss_daily: string;
  max_loss_weekly: string;
  max_transaction_daily: string;
  max_consecutive_loss: string;
  min_r_r: string;
}

interface RiskRule {
  key: keyof RiskFormState;
  label: string;
  limit: number | null;
  actual: number | null;
  suffix: string;
  mode: "maximum" | "minimum";
}

const DEFAULT_FORM: RiskFormState = {
  max_risk: "",
  max_loss_daily: "",
  max_loss_weekly: "",
  max_transaction_daily: "",
  max_consecutive_loss: "",
  min_r_r: "",
};

function toInputValue(
  value: number | string | undefined | null,
): string {
  if (value === undefined || value === null) return "";
  return String(value);
}

function normalizeNumber(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
    )
    .replace(/٫/g, ".")
    .replace(/[٬،]/g, "")
    .replace(/,/g, "")
    .trim();
}

function getNumber(value: string): number | null {
  const normalized = normalizeNumber(value);

  if (!normalized) return null;

  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}

function riskToForm(risk: RiskManagement): RiskFormState {
  return {
    max_risk: toInputValue(risk.max_risk),
    max_loss_daily: toInputValue(risk.max_loss_daily),
    max_loss_weekly: toInputValue(risk.max_loss_weekly),
    max_transaction_daily: toInputValue(
      risk.max_transaction_daily,
    ),
    max_consecutive_loss: toInputValue(
      risk.max_consecutive_loss,
    ),
    min_r_r: toInputValue(risk.min_r_r),
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateUsage(
  actual: number | null,
  limit: number | null,
  mode: "maximum" | "minimum",
): number {
  if (
    actual === null ||
    limit === null ||
    actual <= 0 ||
    limit <= 0
  ) {
    return 0;
  }

  const ratio =
    mode === "maximum"
      ? (Math.abs(actual) / limit) * 100
      : (actual / limit) * 100;

  return Math.min(100, Math.max(0, ratio));
}

function getRuleStatus(
  rule: RiskRule,
  hasActivity: boolean,
) {
  const hasLimit = rule.limit !== null && rule.limit > 0;
  const hasActual = rule.actual !== null && rule.actual > 0;
  const isNeutral = !hasActivity || !hasActual || !hasLimit;

  const progress = isNeutral
    ? 0
    : calculateUsage(rule.actual, rule.limit, rule.mode);

  const isExceeded =
    !isNeutral &&
    rule.mode === "maximum" &&
    Math.abs(rule.actual ?? 0) >= (rule.limit ?? Infinity);

  const meetsMinimum =
    !isNeutral &&
    rule.mode === "minimum" &&
    (rule.actual ?? 0) >= (rule.limit ?? Infinity);

  let statusText: string;

  if (!hasLimit) {
    statusText = "سقف معتبری برای محاسبه تعیین نشده است";
  } else if (isNeutral) {
    statusText = "داده‌ای برای این بازه ثبت نشده است";
  } else if (isExceeded) {
    statusText = "به سقف تعیین‌شده رسیده‌اید یا از آن عبور کرده‌اید";
  } else if (rule.mode === "minimum" && meetsMinimum) {
    statusText = "حداقل تعیین‌شده رعایت شده است";
  } else {
    statusText = `${formatNumber(progress)}٪ از حد تعیین‌شده`;
  }

  const colorClass = isNeutral
    ? "[&>div]:bg-muted-foreground/30"
    : isExceeded
      ? "[&>div]:bg-destructive"
      : rule.mode === "minimum"
        ? meetsMinimum
          ? "[&>div]:bg-emerald-500"
          : "[&>div]:bg-amber-500"
        : progress >= 80
          ? "[&>div]:bg-amber-500"
          : "[&>div]:bg-emerald-500";

  return {
    progress,
    statusText,
    isNeutral,
    isExceeded,
    colorClass,
  };
}

function RiskPage() {
  const [form, setForm] = useState<RiskFormState>(DEFAULT_FORM);
  const [savedRisk, setSavedRisk] =
    useState<RiskManagement | null>(null);
  const [usage, setUsage] = useState<RiskUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);

  const loadRisk = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);

    setError(null);
    setUsageError(null);

    try {
      const risk = await getRiskManagement();

      setSavedRisk(risk);
      setForm(riskToForm(risk));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "خطا در دریافت تنظیمات مدیریت ریسک.";

      setError(message);
    }

    try {
      const latestUsage = await getRiskUsage();
      setUsage(latestUsage);
    } catch (err) {
      setUsage(null);

      setUsageError(
        err instanceof Error
          ? err.message
          : "دریافت آمار واقعی معاملات ناموفق بود.",
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const refreshRisk = useCallback(async () => {
    setRefreshing(true);

    try {
      await loadRisk(false);
      toast.success("اطلاعات مدیریت ریسک به‌روزرسانی شد.");
    } finally {
      setRefreshing(false);
    }
  }, [loadRisk]);

  useEffect(() => {
    void loadRisk();
  }, [loadRisk]);

  useEffect(() => {
    const handlePortfolioChanged = () => {
      void loadRisk();
    };

    const handleStorageChanged = (event: StorageEvent) => {
      if (event.key === ACTIVE_PORTFOLIO_STORAGE_KEY) {
        void loadRisk();
      }
    };

    window.addEventListener(
      ACTIVE_PORTFOLIO_CHANGED_EVENT,
      handlePortfolioChanged,
    );
    window.addEventListener("storage", handleStorageChanged);

    return () => {
      window.removeEventListener(
        ACTIVE_PORTFOLIO_CHANGED_EVENT,
        handlePortfolioChanged,
      );
      window.removeEventListener("storage", handleStorageChanged);
    };
  }, [loadRisk]);

  function handleChange(
    field: keyof RiskFormState,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedForm: UpdateRiskManagementInput = {
      max_risk: normalizeNumber(form.max_risk),
      max_loss_daily: normalizeNumber(form.max_loss_daily),
      max_loss_weekly: normalizeNumber(form.max_loss_weekly),
      max_transaction_daily: normalizeNumber(
        form.max_transaction_daily,
      ),
      max_consecutive_loss: normalizeNumber(
        form.max_consecutive_loss,
      ),
      min_r_r: normalizeNumber(form.min_r_r),
    };

    const entries = Object.entries(normalizedForm);

    if (entries.some(([, value]) => value === "")) {
      toast.error("لطفاً تمام قوانین مدیریت ریسک را تکمیل کنید.");
      return;
    }

    if (
      entries.some(
        ([, value]) => !Number.isFinite(Number(value)),
      )
    ) {
      toast.error("مقادیر واردشده باید عدد معتبر باشند.");
      return;
    }

    if (entries.some(([, value]) => Number(value) < 0)) {
      toast.error("مقادیر مدیریت ریسک نمی‌توانند منفی باشند.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await updateRiskManagement(normalizedForm);

      // بعد از ذخیره، هم قوانین و هم آمار را دوباره دریافت می‌کنیم.
      const latestRisk = await getRiskManagement();

      setSavedRisk(latestRisk);
      setForm(riskToForm(latestRisk));

      try {
        const latestUsage = await getRiskUsage();
        setUsage(latestUsage);
        setUsageError(null);
      } catch (usageErr) {
        setUsage(null);
        setUsageError(
          usageErr instanceof Error
            ? usageErr.message
            : "دریافت آمار معاملات ناموفق بود.",
        );
      }

      toast.success("قوانین مدیریت ریسک با موفقیت ذخیره شد.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "خطا در ذخیره قوانین مدیریت ریسک.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const rules: RiskRule[] = [
    {
      key: "max_risk",
      label: "حداکثر ریسک هر معامله",
      limit: getNumber(form.max_risk),
      actual: usage?.max_risk_in_trade ?? null,
      suffix: "%",
      mode: "maximum",
    },
    {
      key: "max_loss_daily",
      label: "حداکثر ضرر روزانه",
      limit: getNumber(form.max_loss_daily),
      actual: usage?.max_risk_in_day ?? null,
      suffix: "%",
      mode: "maximum",
    },
    {
      key: "max_loss_weekly",
      label: "حداکثر ضرر هفتگی",
      limit: getNumber(form.max_loss_weekly),
      actual: usage?.max_risk_in_week ?? null,
      suffix: "%",
      mode: "maximum",
    },
    {
      key: "max_transaction_daily",
      label: "حداکثر معاملات روزانه",
      limit: getNumber(form.max_transaction_daily),
      actual: usage?.max_transaction_in_day ?? null,
      suffix: " معامله",
      mode: "maximum",
    },
    {
      key: "max_consecutive_loss",
      label: "حداکثر ضرر متوالی",
      limit: getNumber(form.max_consecutive_loss),
      actual: usage?.max_consecutive_loss ?? null,
      suffix: " ضرر",
      mode: "maximum",
    },
    {
      key: "min_r_r",
      label: "حداقل R:R",
      limit: getNumber(form.min_r_r),
      actual: usage?.min_r_r ?? null,
      suffix: "",
      mode: "minimum",
    },
  ];

  const hasActivity = Boolean(
    usage &&
      (
        usage.max_risk_in_trade > 0 ||
        usage.max_risk_in_day > 0 ||
        usage.max_risk_in_week > 0 ||
        usage.max_transaction_in_day > 0 ||
        usage.max_consecutive_loss > 0
      ),
  );

  return (
    <AppShell
      title="مدیریت ریسک"
      subtitle="قوانین خود را تنظیم کنید و مصرف واقعی آن‌ها را بررسی کنید"
    >
      <div className="space-y-6">
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadRisk()}
              disabled={loading || saving}
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              تلاش مجدد
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="card-surface space-y-6 p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">تعریف قوانین</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  تغییرات پس از ذخیره از سرور دریافت می‌شوند.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refreshRisk()}
                disabled={loading || refreshing || saving}
              >
                {refreshing ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="ml-2 h-4 w-4" />
                )}
                به‌روزرسانی
              </Button>
            </div>

            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال دریافت تنظیمات مدیریت ریسک...
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="max_risk">
                      حداکثر ریسک هر معامله (٪)
                    </Label>
                    <Input
                      id="max_risk"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.max_risk}
                      onChange={(event) =>
                        handleChange("max_risk", event.target.value)
                      }
                      disabled={saving}
                      className="bg-secondary/60 tabular"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_loss_daily">
                      حداکثر ضرر روزانه (٪)
                    </Label>
                    <Input
                      id="max_loss_daily"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.max_loss_daily}
                      onChange={(event) =>
                        handleChange(
                          "max_loss_daily",
                          event.target.value,
                        )
                      }
                      disabled={saving}
                      className="bg-secondary/60 tabular"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_loss_weekly">
                      حداکثر ضرر هفتگی (٪)
                    </Label>
                    <Input
                      id="max_loss_weekly"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.max_loss_weekly}
                      onChange={(event) =>
                        handleChange(
                          "max_loss_weekly",
                          event.target.value,
                        )
                      }
                      disabled={saving}
                      className="bg-secondary/60 tabular"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_transaction_daily">
                      حداکثر معاملات روزانه
                    </Label>
                    <Input
                      id="max_transaction_daily"
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={form.max_transaction_daily}
                      onChange={(event) =>
                        handleChange(
                          "max_transaction_daily",
                          event.target.value,
                        )
                      }
                      disabled={saving}
                      className="bg-secondary/60 tabular"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_consecutive_loss">
                      حداکثر ضرر متوالی
                    </Label>
                    <Input
                      id="max_consecutive_loss"
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={form.max_consecutive_loss}
                      onChange={(event) =>
                        handleChange(
                          "max_consecutive_loss",
                          event.target.value,
                        )
                      }
                      disabled={saving}
                      className="bg-secondary/60 tabular"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min_r_r">حداقل R:R</Label>
                    <Input
                      id="min_r_r"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.min_r_r}
                      onChange={(event) =>
                        handleChange("min_r_r", event.target.value)
                      }
                      disabled={saving}
                      className="bg-secondary/60 tabular"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="ml-2 h-4 w-4" />
                  )}
                  {saving ? "در حال ذخیره..." : "ذخیره قوانین"}
                </Button>
              </>
            )}
          </form>

          <div className="card-surface p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">وضعیت مدیریت ریسک</h3>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              مصرف شاخص‌ها نسبت به سقف‌های ذخیره‌شده
            </p>

            {usageError && (
              <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                {usageError}
                <p className="mt-1">
                  نوارها تا دریافت آمار معتبر، خالی باقی می‌مانند.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-6">
              {rules.map((rule) => {
                const status = getRuleStatus(rule, hasActivity);
                const limitText =
                  rule.limit === null
                    ? "—"
                    : `${formatNumber(rule.limit)}${rule.suffix}`;

                const actualText =
                  rule.actual === null
                    ? "—"
                    : `${formatNumber(rule.actual)}${rule.suffix}`;

                return (
                  <div key={rule.key}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {rule.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          مصرف: {status.isNeutral ? "۰" : actualText}
                          {" · "}
                          سقف: {limitText}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          status.isNeutral
                            ? "border-border text-muted-foreground"
                            : status.isExceeded
                              ? "border-destructive/40 bg-destructive/10 text-destructive"
                              : "border-primary/30 text-primary"
                        }
                      >
                        {status.isNeutral
                          ? "خنثی"
                          : `${formatNumber(status.progress)}٪`}
                      </Badge>
                    </div>

                    <Progress
                      value={status.progress}
                      className={`mt-2 h-2 bg-muted ${status.colorClass}`}
                    />

                    <div className="mt-2 flex items-start gap-1 text-xs">
                      {status.isNeutral ? (
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      ) : status.isExceeded ? (
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      )}

                      <span
                        className={
                          status.isExceeded
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {status.statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {savedRisk?.portfolio != null && (
              <p className="mt-5 border-t pt-3 text-xs text-muted-foreground">
                شناسه پرتفولیو: {savedRisk.portfolio}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
