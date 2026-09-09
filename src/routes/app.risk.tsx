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
  updateRiskManagement,
  type RiskManagement,
  type UpdateRiskManagementInput,
} from "@/api/risk";

import { toast } from "sonner";

export const Route = createFileRoute("/app/risk")({
  head: () => ({
    meta: [{ title: "مدیریت ریسک" }],
  }),
  component: RiskPage,
});

const ACTIVE_PORTFOLIO_STORAGE_KEY =
  "traderjournal-active-portfolio";

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

const DEFAULT_FORM: RiskFormState = {
  max_risk: "",
  max_loss_daily: "",
  max_loss_weekly: "",
  max_transaction_daily: "",
  max_consecutive_loss: "",
  min_r_r: "",
};

function toInputValue(value: number | string | undefined): string {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function normalizeNumber(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    )
    .replace(/٫/g, ".")
    .replace(/٬/g, "")
    .replace(/,/g, "")
    .trim();
}

function riskToForm(
  risk: RiskManagement,
): RiskFormState {
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

function getUsagePercentage(
  current: string,
  maximum: string,
): number {
  const currentNumber = Number(normalizeNumber(current));
  const maximumNumber = Number(normalizeNumber(maximum));

  if (
    !Number.isFinite(currentNumber) ||
    !Number.isFinite(maximumNumber) ||
    maximumNumber <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, (currentNumber / maximumNumber) * 100),
  );
}

function RiskPage() {
  const [form, setForm] =
    useState<RiskFormState>(DEFAULT_FORM);

  const [savedRisk, setSavedRisk] =
    useState<RiskManagement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadRisk = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const risk = await getRiskManagement();

      setSavedRisk(risk);
      setForm(riskToForm(risk));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "خطا در دریافت تنظیمات مدیریت ریسک.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRisk = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);

      const risk = await getRiskManagement();

      setSavedRisk(risk);
      setForm(riskToForm(risk));

      toast.success("تنظیمات مدیریت ریسک به‌روزرسانی شد.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "خطا در به‌روزرسانی تنظیمات.";

      setError(message);
      toast.error(message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRisk();
  }, [loadRisk]);

  useEffect(() => {
    const handlePortfolioChanged = () => {
      void loadRisk();
    };

    const handleStorageChanged = (
      event: StorageEvent,
    ) => {
      if (
        event.key === ACTIVE_PORTFOLIO_STORAGE_KEY
      ) {
        void loadRisk();
      }
    };

    window.addEventListener(
      ACTIVE_PORTFOLIO_CHANGED_EVENT,
      handlePortfolioChanged,
    );

    window.addEventListener(
      "storage",
      handleStorageChanged,
    );

    return () => {
      window.removeEventListener(
        ACTIVE_PORTFOLIO_CHANGED_EVENT,
        handlePortfolioChanged,
      );

      window.removeEventListener(
        "storage",
        handleStorageChanged,
      );
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

    const fields = Object.entries(normalizedForm);

    const hasEmptyField = fields.some(
      ([, value]) => !value,
    );

    if (hasEmptyField) {
      toast.error(
        "لطفاً تمام قوانین مدیریت ریسک را تکمیل کنید.",
      );
      return;
    }

    const hasInvalidNumber = fields.some(
      ([, value]) => !Number.isFinite(Number(value)),
    );

    if (hasInvalidNumber) {
      toast.error(
        "مقادیر واردشده باید عدد معتبر باشند.",
      );
      return;
    }

    if (
      Number(normalizedForm.max_risk) < 0 ||
      Number(normalizedForm.max_loss_daily) < 0 ||
      Number(normalizedForm.max_loss_weekly) < 0 ||
      Number(normalizedForm.max_transaction_daily) < 0 ||
      Number(normalizedForm.max_consecutive_loss) < 0 ||
      Number(normalizedForm.min_r_r) < 0
    ) {
      toast.error(
        "مقادیر مدیریت ریسک نمی‌توانند منفی باشند.",
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updatedRisk =
        await updateRiskManagement(normalizedForm);

      if (updatedRisk) {
        setSavedRisk(updatedRisk);
        setForm(riskToForm(updatedRisk));
      } else {
        const risk = await getRiskManagement();

        setSavedRisk(risk);
        setForm(riskToForm(risk));
      }

      toast.success(
        "قوانین مدیریت ریسک با موفقیت ذخیره شد.",
      );
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

  const rules = [
    {
      label: "حداکثر ریسک هر معامله",
      value: form.max_risk,
      used: getUsagePercentage(
        form.max_risk,
        "5",
      ),
      suffix: "٪",
      safe: Number(normalizeNumber(form.max_risk)) <= 2,
    },
    {
      label: "حداکثر ضرر روزانه",
      value: form.max_loss_daily,
      used: getUsagePercentage(
        form.max_loss_daily,
        "10",
      ),
      suffix: "٪",
      safe: Number(normalizeNumber(form.max_loss_daily)) <= 5,
    },
    {
      label: "حداکثر ضرر هفتگی",
      value: form.max_loss_weekly,
      used: getUsagePercentage(
        form.max_loss_weekly,
        "20",
      ),
      suffix: "٪",
      safe: Number(normalizeNumber(form.max_loss_weekly)) <= 10,
    },
    {
      label: "حداکثر معاملات روزانه",
      value: form.max_transaction_daily,
      used: getUsagePercentage(
        form.max_transaction_daily,
        "10",
      ),
      suffix: "",
      safe: Number(normalizeNumber(form.max_transaction_daily)) <= 6,
    },
    {
      label: "حداکثر ضرر متوالی",
      value: form.max_consecutive_loss,
      used: getUsagePercentage(
        form.max_consecutive_loss,
        "5",
      ),
      suffix: "",
      safe: Number(normalizeNumber(form.max_consecutive_loss)) <= 3,
    },
    {
      label: "حداقل R:R",
      value: form.min_r_r,
      used: 0,
      suffix: "",
      safe: Number(normalizeNumber(form.min_r_r)) >= 1,
    },
  ];

  return (
    <AppShell
      title="مدیریت ریسک"
      subtitle="قوانین شخصی خود را تعریف کنید و پایبندی به آن‌ها را بسنجید"
    >
      <div className="space-y-6">
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refreshRisk()}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="ml-2 h-4 w-4" />
              )}
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
                <h3 className="font-semibold">
                  تعریف قوانین
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  این قوانین برای پرتفولیوی فعال ذخیره می‌شوند.
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
                      value={form.max_risk}
                      onChange={(event) =>
                        handleChange(
                          "max_risk",
                          event.target.value,
                        )
                      }
                      className="bg-secondary/60 tabular"
                      disabled={saving}
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
                      value={form.max_loss_daily}
                      onChange={(event) =>
                        handleChange(
                          "max_loss_daily",
                          event.target.value,
                        )
                      }
                      className="bg-secondary/60 tabular"
                      disabled={saving}
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
                      value={form.max_loss_weekly}
                      onChange={(event) =>
                        handleChange(
                          "max_loss_weekly",
                          event.target.value,
                        )
                      }
                      className="bg-secondary/60 tabular"
                      disabled={saving}
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
                      value={form.max_transaction_daily}
                      onChange={(event) =>
                        handleChange(
                          "max_transaction_daily",
                          event.target.value,
                        )
                      }
                      className="bg-secondary/60 tabular"
                      disabled={saving}
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
                      value={form.max_consecutive_loss}
                      onChange={(event) =>
                        handleChange(
                          "max_consecutive_loss",
                          event.target.value,
                        )
                      }
                      className="bg-secondary/60 tabular"
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min_r_r">
                      حداقل R:R
                    </Label>

                    <Input
                      id="min_r_r"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.min_r_r}
                      onChange={(event) =>
                        handleChange(
                          "min_r_r",
                          event.target.value,
                        )
                      }
                      className="bg-secondary/60 tabular"
                      disabled={saving}
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
                  {saving
                    ? "در حال ذخیره..."
                    : "ذخیره قوانین"}
                </Button>
              </>
            )}
          </form>

          <div className="card-surface p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />

              <h3 className="font-semibold">
                وضعیت قوانین امروز
              </h3>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              خلاصه تنظیمات پرتفولیوی فعال
            </p>

            <div className="mt-6 space-y-5">
              {rules.map((rule) => (
                <div key={rule.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {rule.label}
                    </span>

                    <Badge
                      variant="outline"
                      className={
                        rule.safe
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                      }
                    >
                      {rule.value || "—"}
                      {rule.value && rule.suffix}
                    </Badge>
                  </div>

                  <Progress
                    value={rule.used}
                    className={`mt-2 h-1.5 ${
                      !rule.safe
                        ? "[&>div]:bg-destructive"
                        : ""
                    }`}
                  />

                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {rule.safe ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        <span className="text-muted-foreground">
                          تنظیم در محدوده مناسب
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                        <span className="text-destructive">
                          مقدار تنظیم‌شده بالا است
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}