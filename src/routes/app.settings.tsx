import { createFileRoute } from "@tanstack/react-router";

import {
  CreditCard,
  User,
  Bell,
  Link2,
  CheckCircle2,
  CircleX,
  Copy,
  Check,
  RefreshCw,
  Download,
  KeyRound,
  MonitorCog,
  Info,
} from "lucide-react";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Switch } from "@/components/ui/switch";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  getMetaTraderStatus,
  downloadMetaTraderEA,
  type MetaTraderStatus,
} from "@/api/metatrader";

import {
  getUserProfile,
  type UserProfile,
} from "@/api/user";

import {
  getCurrentPlan,
  getPlans,
  type CurrentPlan,
  type Plan,
} from "@/api/plan";

import {
  requestPayment,
  verifyPayment,
  type PaymentRequestResponse,
} from "@/api/payment";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "تنظیمات" }],
  }),
  component: SettingsPage,
});

/* =========================================================
   Helpers
========================================================= */

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "—";
  }

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[0]}/${parts[1]}/${parts[2]}`;
}

/* =========================================================
   MetaTrader
========================================================= */

function MetaTraderSettings() {
  const [status, setStatus] =
    useState<MetaTraderStatus | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [downloadingEA, setDownloadingEA] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  const [downloadSuccess, setDownloadSuccess] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  async function loadMetaTraderStatus(
    showRefreshState = false,
  ) {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response =
        await getMetaTraderStatus();

      setStatus(response);
    } catch (err) {
      console.error(
        "Get MetaTrader status error:",
        err,
      );

      const message =
        err instanceof Error
          ? err.message
          : "خطا در دریافت وضعیت متاتریدر";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadMetaTraderStatus();
  }, []);

  async function copyApiKey() {
    if (!status?.api_key) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        status.api_key,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Copy API key error:",
        err,
      );
    }
  }

  async function handleDownloadEA() {
    if (downloadingEA) {
      return;
    }

    try {
      setDownloadingEA(true);
      setDownloadError(null);
      setDownloadSuccess(false);

      const {
        blob,
        filename,
      } = await downloadMetaTraderEA();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        filename || "TradeJournalEA.ex5";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      setDownloadSuccess(true);

      window.setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error(
        "Download MetaTrader EA error:",
        err,
      );

      const message =
        err instanceof Error
          ? err.message
          : "دانلود Expert Advisor انجام نشد.";

      setDownloadError(message);
    } finally {
      setDownloadingEA(false);
    }
  }

  const isConnected =
    status?.connected === true;

  const platform =
    status?.platform?.toLowerCase() === "mt4"
      ? "MT4"
      : status?.platform?.toLowerCase() === "mt5"
        ? "MT5"
        : status?.platform || "—";

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <MonitorCog className="h-6 w-6" />
          </div>

          <div>

            <h3 className="text-lg font-semibold">
              اتصال حساب متاتریدر
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              اتصال حساب MT4/MT5 از طریق Expert Advisor انجام می‌شود.
              اطلاعات حساب به‌صورت خودکار از متاتریدر دریافت خواهد شد.
            </p>

          </div>

        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void loadMetaTraderStatus(true);
          }}
          disabled={loading || refreshing}
          className="shrink-0"
        >

          <RefreshCw
            className={`ml-2 h-4 w-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          بروزرسانی وضعیت

        </Button>

      </div>

      {loading && (
        <div className="card-surface p-6">

          <div className="flex items-center justify-center py-10">

            <div className="text-center">

              <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary" />

              <p className="mt-3 text-sm text-muted-foreground">
                در حال دریافت وضعیت متاتریدر...
              </p>

            </div>

          </div>

        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">

          <div className="flex items-start gap-3">

            <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div className="flex-1">

              <div className="font-semibold text-destructive">
                دریافت وضعیت متاتریدر انجام نشد
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  void loadMetaTraderStatus();
                }}
              >
                تلاش مجدد
              </Button>

            </div>

          </div>

        </div>
      )}

      {!loading && !error && status && (
        <>

          <div className="card-surface p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="text-sm text-muted-foreground">
                  وضعیت اتصال
                </div>

                <div className="mt-2 flex items-center gap-2">

                  {isConnected ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-primary" />

                      <span className="text-xl font-bold">
                        متصل است
                      </span>

                      <Badge className="mr-1 bg-primary text-primary-foreground">
                        فعال
                      </Badge>
                    </>
                  ) : (
                    <>
                      <CircleX className="h-5 w-5 text-destructive" />

                      <span className="text-xl font-bold">
                        متصل نیست
                      </span>

                      <Badge
                        variant="outline"
                        className="mr-1 border-destructive/40 bg-destructive/5 text-destructive"
                      >
                        غیرفعال
                      </Badge>
                    </>
                  )}

                </div>

              </div>

              <div className="rounded-lg bg-secondary/50 px-4 py-3 text-sm">

                <span className="text-muted-foreground">
                  پلتفرم:
                </span>

                <span className="mr-2 font-semibold">
                  {platform}
                </span>

              </div>

            </div>

            {isConnected && (
              <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-lg bg-secondary/40 p-4">

                  <div className="text-xs text-muted-foreground">
                    پلتفرم
                  </div>

                  <div
                    dir="ltr"
                    className="mt-2 text-sm font-semibold"
                  >
                    {platform}
                  </div>

                </div>

                <div className="rounded-lg bg-secondary/40 p-4">

                  <div className="text-xs text-muted-foreground">
                    سرور
                  </div>

                  <div
                    dir="ltr"
                    className="mt-2 break-all font-mono text-sm font-semibold"
                  >
                    {status.server || "—"}
                  </div>

                </div>

                <div className="rounded-lg bg-secondary/40 p-4">

                  <div className="text-xs text-muted-foreground">
                    شماره حساب
                  </div>

                  <div
                    dir="ltr"
                    className="mt-2 font-mono text-sm font-semibold"
                  >
                    {status.account_number || "—"}
                  </div>

                </div>

              </div>
            )}

          </div>

          <div className="card-surface p-6">

            <div className="flex items-start gap-3">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>

              <div>

                <h3 className="font-semibold">
                  API Key متاتریدر
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  این کلید را در تنظیمات Expert Advisor متاتریدر وارد کنید.
                </p>

              </div>

            </div>

            <div className="mt-5">

              <Label>
                کلید اتصال
              </Label>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">

                <Input
                  readOnly
                  value={status.api_key || ""}
                  dir="ltr"
                  placeholder="API Key دریافت نشد"
                  className="bg-secondary/60 font-mono text-xs"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={copyApiKey}
                  disabled={!status.api_key}
                  className="shrink-0"
                >

                  {copied ? (
                    <>
                      <Check className="ml-2 h-4 w-4 text-primary" />
                      کپی شد
                    </>
                  ) : (
                    <>
                      <Copy className="ml-2 h-4 w-4" />
                      کپی API Key
                    </>
                  )}

                </Button>

              </div>

            </div>

            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">

              <div className="flex items-start gap-2">

                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <p className="text-xs leading-6 text-muted-foreground">
                  این کلید توسط سرور برای حساب شما ساخته شده و
                  برای اتصال Expert Advisor به TraderJournal استفاده می‌شود.
                  آن را فقط داخل MetaTrader خودتان وارد کنید و در اختیار افراد دیگر قرار ندهید.
                </p>

              </div>

            </div>

          </div>

          <div className="card-surface p-6">

            <div className="flex items-start gap-3">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="h-5 w-5" />
              </div>

              <div>

                <h3 className="font-semibold">
                  راهنمای اتصال MetaTrader
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  برای اتصال، مراحل زیر را در MetaTrader انجام دهید.
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-5">

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۱
                </div>

                <div>

                  <div className="font-medium">
                    API Key را کپی کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    از قسمت بالا API Key اختصاصی خودتان را کپی کنید.
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۲
                </div>

                <div className="flex-1">

                  <div className="font-medium">
                    Expert Advisor را دانلود کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    فایل رسمی EA مخصوص اتصال TraderJournal را از همین صفحه دانلود کنید.
                  </p>

                  <div className="mt-3">

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        void handleDownloadEA();
                      }}
                      disabled={downloadingEA}
                    >

                      {downloadingEA ? (
                        <>
                          <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                          در حال دانلود...
                        </>
                      ) : (
                        <>
                          <Download className="ml-2 h-4 w-4" />
                          دانلود TradeJournalEA.ex5
                        </>
                      )}

                    </Button>

                  </div>

                  {downloadSuccess && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-primary">

                      <CheckCircle2 className="h-4 w-4" />

                      فایل TradeJournalEA.ex5 با موفقیت دانلود شد.

                    </div>
                  )}

                  {downloadError && (
                    <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">

                      <div className="flex items-start gap-2">

                        <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

                        <div>

                          <div className="text-sm font-medium text-destructive">
                            دانلود فایل انجام نشد
                          </div>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {downloadError}
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۳
                </div>

                <div>

                  <div className="font-medium">
                    فایل EA را داخل MetaTrader قرار دهید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در MetaTrader از مسیر
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      File → Open Data Folder
                    </span>
                    {" "}
                    وارد پوشه اطلاعات متاتریدر شوید.
                    سپس وارد مسیر
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      MQL5 → Experts
                    </span>
                    {" "}
                    شوید و فایل
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      TradeJournalEA.ex5
                    </span>
                    {" "}
                    را داخل آن قرار دهید.
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۴
                </div>

                <div>

                  <div className="font-medium">
                    EA را در MetaTrader فعال کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در MetaTrader از بخش
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      Navigator → Expert Advisors
                    </span>
                    {" "}
                    گزینه
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      TradeJournalEA
                    </span>
                    {" "}
                    را پیدا کنید و آن را روی Chart موردنظر بکشید.
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۵
                </div>

                <div>

                  <div className="font-medium">
                    API Key را وارد کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در پنجره تنظیمات EA وارد بخش
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      Inputs
                    </span>
                    {" "}
                    شوید و API Key را داخل فیلد
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      ApiKey
                    </span>
                    {" "}
                    قرار دهید.
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۶
                </div>

                <div>

                  <div className="font-medium">
                    اجازه اجرای EA را فعال کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در تب
                    {" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      Common
                    </span>
                    {" "}
                    گزینه
                    {" "}
                    <span className="font-medium text-foreground">
                      Allow live trading
                    </span>
                    {" "}
                    را فعال کرده و روی OK بزنید.
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۷
                </div>

                <div>

                  <div className="font-medium">
                    در صورت نیاز WebRequest را فعال کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    اگر MetaTrader برای ارسال درخواست نیاز به
                    WebRequest داشت، از مسیر زیر آدرس سرور بک‌اند را
                    در لیست مجاز قرار دهید:
                  </p>

                  <div className="mt-3 rounded-lg bg-secondary/50 p-3">

                    <div
                      dir="ltr"
                      className="text-xs leading-6 text-muted-foreground"
                    >
                      Tools → Options → Expert Advisors
                    </div>

                    <div className="mt-2 text-xs leading-5 text-muted-foreground">
                      سپس گزینه
                      {" "}
                      <span className="font-medium text-foreground">
                        Allow WebRequest for listed URL
                      </span>
                      {" "}
                      را فعال کنید و آدرس اعلام‌شده توسط تیم بک‌اند را
                      به لیست اضافه کنید.
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {!isConnected && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">

              <div className="flex items-start gap-3">

                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                <div>

                  <div className="font-semibold">
                    حساب هنوز متصل نشده است
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    ابتدا Expert Advisor را دانلود و روی MetaTrader نصب کنید،
                    API Key بالا را در قسمت ApiKey وارد کنید و متاتریدر را
                    باز نگه دارید. بعد از آن روی «بروزرسانی وضعیت» کلیک کنید.
                  </p>

                </div>

              </div>

            </div>
          )}

          {isConnected && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">

              <div className="flex items-start gap-3">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>

                  <div className="font-semibold text-primary">
                    حساب متاتریدر با موفقیت متصل است
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    اطلاعات حساب شما توسط Expert Advisor دریافت شده
                    و اتصال به TraderJournal برقرار است.
                  </p>

                </div>

              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
}

/* =========================================================
   Subscription Settings
========================================================= */

function SubscriptionSettings() {
  const [currentPlan, setCurrentPlan] =
    useState<CurrentPlan | null>(null);

  const [plans, setPlans] =
    useState<Plan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedPlanId, setSelectedPlanId] =
    useState<number | null>(null);

  const [discountCode, setDiscountCode] =
    useState("");

  const [discountApplied, setDiscountApplied] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [paymentResult, setPaymentResult] =
    useState<PaymentRequestResponse | null>(null);

  const [verifyLoading, setVerifyLoading] =
    useState(false);

  const [verifyMessage, setVerifyMessage] =
    useState<string | null>(null);

  async function loadSubscription(
    showRefreshState = false,
  ) {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [
        currentPlanResponse,
        plansResponse,
      ] = await Promise.all([
        getCurrentPlan(),
        getPlans(),
      ]);

      setCurrentPlan(currentPlanResponse);
      setPlans(plansResponse);

      const matchingPlan =
        plansResponse.find(
          (plan) =>
            plan.id === currentPlanResponse.type,
        );

      if (matchingPlan) {
        setSelectedPlanId(matchingPlan.id);
      } else if (plansResponse.length > 0) {
        const firstPaidPlan =
          plansResponse.find(
            (plan) => plan.price > 0,
          );

        setSelectedPlanId(
          firstPaidPlan?.id ??
            plansResponse[0].id,
        );
      }
    } catch (err) {
      console.error(
        "Get subscription information error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "خطا در دریافت اطلاعات اشتراک",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadSubscription();
  }, []);

  /*
   * بررسی برگشت از درگاه.
   *
   * Endpoint verify طبق Swagger پارامتر رسمی ندارد
   * و authority را از callback دریافت می‌کند.
   *
   * بنابراین اگر authority در URL وجود داشته باشد،
   * verify را فراخوانی می‌کنیم.
   */
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search,
      );

    const authority =
      params.get("Authority") ||
      params.get("authority");

    if (!authority) {
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        setVerifyLoading(true);
        setVerifyMessage(null);

        const response =
          await verifyPayment();

        if (cancelled) {
          return;
        }

        if (response.success) {
          setVerifyMessage(
            response.message ||
              "پرداخت با موفقیت تأیید شد.",
          );

          await loadSubscription(true);
        } else {
          setVerifyMessage(
            response.message ||
              "تأیید پرداخت انجام نشد.",
          );
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Verify payment error:",
          err,
        );

        setVerifyMessage(
          err instanceof Error
            ? err.message
            : "خطا در تأیید پرداخت",
        );
      } finally {
        if (!cancelled) {
          setVerifyLoading(false);
        }
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleDiscountApply() {
    const code =
      discountCode.trim();

    if (!code) {
      setDiscountApplied(false);
      setPaymentError(
        "ابتدا کد تخفیف را وارد کنید.",
      );
      return;
    }

    setPaymentError(null);
    setDiscountApplied(true);
  }

  async function handlePayment() {
    if (paymentLoading) {
      return;
    }

    setPaymentError(null);
    setPaymentResult(null);

    if (!selectedPlanId) {
      setPaymentError(
        "ابتدا یک پلن را انتخاب کنید.",
      );
      return;
    }

    const selectedPlan =
      plans.find(
        (plan) =>
          plan.id === selectedPlanId,
      );

    if (!selectedPlan) {
      setPaymentError(
        "پلن انتخاب‌شده پیدا نشد. لطفاً دوباره تلاش کنید.",
      );
      return;
    }

    /*
     * پلن رایگان نیازی به درگاه پرداخت ندارد.
     * برای جلوگیری از ارسال درخواست اشتباه به payment/request
     * آن را مستقیماً متوقف می‌کنیم.
     */
    if (selectedPlan.price <= 0) {
      setPaymentError(
        "این پلن رایگان است و نیازی به پرداخت ندارد.",
      );
      return;
    }

    try {
      setPaymentLoading(true);

      const response =
        await requestPayment({
          subscription_id:
            selectedPlan.id,
          discount_code:
            discountCode.trim(),
        });

      setPaymentResult(response);

      if (!response.success) {
        setPaymentError(
          "ایجاد درخواست پرداخت انجام نشد.",
        );
        return;
      }

      if (!response.payment_url) {
        setPaymentError(
          "لینک پرداخت از سرور دریافت نشد.",
        );
        return;
      }

      /*
       * ابتدا نتیجه درخواست را نشان می‌دهیم،
       * سپس کاربر را به درگاه منتقل می‌کنیم.
       */
      window.location.href =
        response.payment_url;
    } catch (err) {
      console.error(
        "Request payment error:",
        err,
      );

      setPaymentError(
        err instanceof Error
          ? err.message
          : "خطا در ایجاد درخواست پرداخت",
      );
    } finally {
      setPaymentLoading(false);
    }
  }

  const selectedPlan =
    plans.find(
      (plan) =>
        plan.id === selectedPlanId,
    ) ?? null;

  if (loading) {
    return (
      <div className="card-surface p-6">

        <div className="flex items-center justify-center py-12">

          <div className="text-center">

            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary" />

            <p className="mt-3 text-sm text-muted-foreground">
              در حال دریافت اطلاعات اشتراک...
            </p>

          </div>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">

        <div className="flex items-start gap-3">

          <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

          <div className="flex-1">

            <div className="font-semibold text-destructive">
              دریافت اطلاعات اشتراک انجام نشد
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => {
                void loadSubscription();
              }}
            >
              تلاش مجدد
            </Button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* =====================================================
          Payment verification result
      ===================================================== */}

      {verifyLoading && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">

          <div className="flex items-center gap-2 text-sm">

            <RefreshCw className="h-4 w-4 animate-spin text-primary" />

            در حال بررسی نتیجه پرداخت...

          </div>

        </div>
      )}

      {verifyMessage && !verifyLoading && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">

          <div className="flex items-start gap-2">

            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-sm leading-6">
              {verifyMessage}
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          Current Plan
      ===================================================== */}

      <div className="grid gap-4 lg:grid-cols-3">

        <div className="card-surface p-6 lg:col-span-2">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <div className="text-sm text-muted-foreground">
                اشتراک فعلی
              </div>

              <div className="mt-1 text-2xl font-bold">
                {currentPlan?.type_name || "—"}
              </div>

            </div>

            <Badge className="w-fit bg-primary text-primary-foreground">
              فعال
            </Badge>

          </div>

          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">

            <div>

              <div className="text-muted-foreground">
                شروع
              </div>

              <div className="mt-1 tabular">
                {formatDate(
                  currentPlan?.start_date,
                )}
              </div>

            </div>

            <div>

              <div className="text-muted-foreground">
                پایان
              </div>

              <div className="mt-1 tabular">
                {formatDate(
                  currentPlan?.end_date,
                )}
              </div>

            </div>

            <div>

              <div className="text-muted-foreground">
                نوع پلن
              </div>

              <div className="mt-1">
                {currentPlan?.type_name || "—"}
              </div>

            </div>

          </div>

          <div className="mt-6 flex flex-wrap gap-2">

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void loadSubscription(true);
              }}
              disabled={refreshing}
            >

              <RefreshCw
                className={`ml-2 h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              بروزرسانی اشتراک

            </Button>

            <Button
              type="button"
              variant="outline"
              disabled
            >
              مشاهده فاکتورها
            </Button>

          </div>

        </div>

        {/* ===================================================
            Discount
        =================================================== */}

        <div className="card-surface p-6">

          <div className="font-semibold">
            کد تخفیف
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            کد تخفیف هنگام ایجاد درخواست پرداخت برای بک‌اند ارسال می‌شود.
          </p>

          <div className="mt-4 flex gap-2">

            <Input
              value={discountCode}
              onChange={(event) => {
                setDiscountCode(
                  event.target.value,
                );
                setDiscountApplied(false);
                setPaymentError(null);
              }}
              placeholder="کد را وارد کنید"
              className="bg-secondary/60"
              dir="ltr"
            />

            <Button
              type="button"
              variant="outline"
              onClick={handleDiscountApply}
            >
              اعمال
            </Button>

          </div>

          {discountApplied && (
            <div className="mt-3 flex items-center gap-2 text-sm text-primary">

              <CheckCircle2 className="h-4 w-4" />

              کد تخفیف برای پرداخت آماده شد.

            </div>
          )}

          <div className="mt-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">

            <CheckCircle2 className="ml-1 inline h-4 w-4" />

            پرداخت از طریق زرین‌پال

          </div>

        </div>

      </div>

      {/* =====================================================
          Available Plans
      ===================================================== */}

      <div className="card-surface p-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h3 className="text-lg font-semibold">
              انتخاب پلن
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              پلن موردنظر خود را انتخاب کرده و سپس پرداخت را انجام دهید.
            </p>

          </div>

          {selectedPlan && (
            <Badge variant="outline">
              انتخاب‌شده: {selectedPlan.name}
            </Badge>
          )}

        </div>

        {plans.length === 0 ? (
          <div className="mt-6 rounded-lg border border-border p-5 text-center text-sm text-muted-foreground">
            در حال حاضر پلنی برای خرید وجود ندارد.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {plans.map((plan) => {

              const isSelected =
                selectedPlanId === plan.id;

              const isCurrent =
                currentPlan?.type === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlanId(
                      plan.id,
                    );
                    setPaymentError(null);
                    setPaymentResult(null);
                  }}
                  className={`rounded-xl border p-5 text-right transition ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-secondary/20 hover:border-primary/50"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <div className="font-semibold">
                        {plan.name}
                      </div>

                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="mt-2"
                        >
                          پلن فعلی
                        </Badge>
                      )}

                    </div>

                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    )}

                  </div>

                  <div className="mt-5 text-xl font-bold tabular">
                    {formatPrice(plan.price)}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {plan.price > 0
                      ? "قابل پرداخت از طریق زرین‌پال"
                      : "رایگان"}
                  </div>

                </button>
              );
            })}

          </div>
        )}

      </div>

      {/* =====================================================
          Payment Summary
      ===================================================== */}

      {selectedPlan && (
        <div className="card-surface p-6">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>

              <h3 className="font-semibold">
                خلاصه پرداخت
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedPlan.name}
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-lg bg-secondary/40 p-4">

              <div className="text-xs text-muted-foreground">
                مبلغ اصلی
              </div>

              <div className="mt-2 font-semibold tabular">
                {formatPrice(
                  paymentResult?.original_amount ??
                    selectedPlan.price,
                )}
              </div>

            </div>

            <div className="rounded-lg bg-secondary/40 p-4">

              <div className="text-xs text-muted-foreground">
                تخفیف
              </div>

              <div className="mt-2 font-semibold tabular text-primary">
                {formatPrice(
                  paymentResult?.discount_amount ??
                    0,
                )}
              </div>

            </div>

            <div className="rounded-lg bg-primary/10 p-4">

              <div className="text-xs text-muted-foreground">
                مبلغ قابل پرداخت
              </div>

              <div className="mt-2 font-bold tabular">
                {formatPrice(
                  paymentResult?.amount ??
                    selectedPlan.price,
                )}
              </div>

            </div>

          </div>

          {paymentError && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">

              <div className="flex items-start gap-2">

                <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                <div>

                  <div className="font-medium text-destructive">
                    پرداخت انجام نشد
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {paymentError}
                  </p>

                </div>

              </div>

            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">

            <Button
              type="button"
              onClick={() => {
                void handlePayment();
              }}
              disabled={
                paymentLoading ||
                !selectedPlan ||
                selectedPlan.price <= 0
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >

              {paymentLoading ? (
                <>
                  <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                  در حال ایجاد درخواست پرداخت...
                </>
              ) : (
                <>
                  <CreditCard className="ml-2 h-4 w-4" />
                  پرداخت و تمدید اشتراک
                </>
              )}

            </Button>

            {discountCode.trim() && (
              <div className="text-xs text-muted-foreground">
                کد تخفیف:
                {" "}
                <span
                  dir="ltr"
                  className="font-mono text-foreground"
                >
                  {discountCode.trim()}
                </span>
              </div>
            )}

          </div>

          {paymentResult?.success && (
            <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4">

              <div className="flex items-start gap-2">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>

                  <div className="font-medium text-primary">
                    درخواست پرداخت با موفقیت ایجاد شد
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در حال انتقال به درگاه پرداخت زرین‌پال...
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   Settings Page
========================================================= */

function SettingsPage() {
  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [userLoading, setUserLoading] =
    useState(true);

  const [userError, setUserError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadUserInfo() {
      try {
        setUserLoading(true);
        setUserError(null);

        const response =
          await getUserProfile();

        setUser(response);
      } catch (err) {
        console.error(
          "Get user info error:",
          err,
        );

        setUserError(
          err instanceof Error
            ? err.message
            : "خطا در دریافت کاربر",
        );
      } finally {
        setUserLoading(false);
      }
    }

    void loadUserInfo();
  }, []);

  const fullName =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "کاربر";

  const initials =
    `${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""}` ||
    "ک";

  return (
    <AppShell
      title="تنظیمات"
      subtitle="مدیریت حساب، اشتراک و اتصالات"
    >

      <Tabs
        defaultValue="profile"
        dir="rtl"
      >

        <TabsList>

          <TabsTrigger value="profile">
            <User className="ml-1 h-4 w-4" />
            پروفایل
          </TabsTrigger>

          <TabsTrigger value="subscription">
            <CreditCard className="ml-1 h-4 w-4" />
            اشتراک
          </TabsTrigger>

          <TabsTrigger value="mt">
            <Link2 className="ml-1 h-4 w-4" />
            متاتریدر
          </TabsTrigger>

          <TabsTrigger value="notifications">
            <Bell className="ml-1 h-4 w-4" />
            اعلان‌ها
          </TabsTrigger>

        </TabsList>

        {/* =================================================
            Profile
        ================================================= */}

        <TabsContent
          value="profile"
          className="mt-6"
        >

          <div className="card-surface p-6">

            {userLoading ? (
              <div className="flex items-center justify-center py-10">

                <div className="text-center">

                  <RefreshCw className="mx-auto h-7 w-7 animate-spin text-primary" />

                  <p className="mt-3 text-sm text-muted-foreground">
                    در حال دریافت اطلاعات کاربر...
                  </p>

                </div>

              </div>
            ) : userError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">

                <div className="flex items-start gap-3">

                  <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                  <div>

                    <div className="font-semibold text-destructive">
                      خطا در دریافت اطلاعات کاربر
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {userError}
                    </p>

                  </div>

                </div>

              </div>
            ) : (
              <>

                <div className="flex items-center gap-4">

                  <Avatar className="h-16 w-16">

                    {user?.image_profile && (
                      <AvatarImage
                        src={user.image_profile}
                        alt={fullName}
                      />
                    )}

                    <AvatarFallback className="bg-primary/20 text-lg font-bold text-primary">
                      {initials}
                    </AvatarFallback>

                  </Avatar>

                  <div>

                    <div className="font-semibold">
                      {fullName}
                    </div>

                    <div
                      dir="ltr"
                      className="text-sm text-muted-foreground"
                    >
                      {user?.email || "—"}
                    </div>

                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mr-auto"
                    disabled
                  >
                    تغییر عکس
                  </Button>

                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <div className="space-y-2">

                    <Label>
                      نام
                    </Label>

                    <Input
                      value={user?.first_name ?? ""}
                      readOnly
                      className="bg-secondary/60"
                    />

                  </div>

                  <div className="space-y-2">

                    <Label>
                      نام خانوادگی
                    </Label>

                    <Input
                      value={user?.last_name ?? ""}
                      readOnly
                      className="bg-secondary/60"
                    />

                  </div>

                  <div className="space-y-2">

                    <Label>
                      ایمیل
                    </Label>

                    <Input
                      value={user?.email ?? ""}
                      readOnly
                      dir="ltr"
                      className="bg-secondary/60"
                    />

                  </div>

                  <div className="space-y-2">

                    <Label>
                      موبایل
                    </Label>

                    <Input
                      value={user?.phone ?? ""}
                      readOnly
                      dir="ltr"
                      placeholder="ثبت نشده"
                      className="bg-secondary/60 tabular"
                    />

                  </div>

                </div>

                <div className="mt-6">

                  <Button
                    type="button"
                    disabled
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    ذخیره تغییرات
                  </Button>

                  <p className="mt-2 text-xs text-muted-foreground">
                    ویرایش اطلاعات تا زمان ارائه API ویرایش کاربر
                    غیرفعال است.
                  </p>

                </div>

              </>
            )}

          </div>

        </TabsContent>

        {/* =================================================
            Subscription
        ================================================= */}

        <TabsContent
          value="subscription"
          className="mt-6"
        >
          <SubscriptionSettings />
        </TabsContent>

        {/* =================================================
            MetaTrader
        ================================================= */}

        <TabsContent
          value="mt"
          className="mt-6"
        >
          <MetaTraderSettings />
        </TabsContent>

        {/* =================================================
            Notifications
        ================================================= */}

        <TabsContent
          value="notifications"
          className="mt-6"
        >

          <div className="card-surface space-y-4 p-6">

            {[
              {
                t: "یادآوری ثبت ژورنال",
                d: "شب‌ها اگر ژورنال ثبت نشده باشد یادآوری کن.",
              },
              {
                t: "هشدار نزدیک شدن به سقف ریسک",
                d: "وقتی ۸۰٪ ضرر روزانه رخ داد.",
              },
              {
                t: "گزارش هفتگی AI",
                d: "خلاصه عملکرد هفتگی به ایمیل ارسال شود.",
              },
              {
                t: "رفتار غیرعادی معاملاتی",
                d: "شناسایی FOMO یا Revenge Trading.",
              },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-secondary/40 p-4"
              >

                <div>

                  <div className="font-medium">
                    {n.t}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {n.d}
                  </div>

                </div>

                <Switch defaultChecked={i < 3} />

              </div>
            ))}

          </div>

        </TabsContent>

      </Tabs>

    </AppShell>
  );
}