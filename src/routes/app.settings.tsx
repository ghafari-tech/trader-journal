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
  ExternalLink,
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
} from "@/components/ui/avatar";

import {
  getMetaTraderStatus,
  type MetaTraderStatus,
} from "@/api/metatrader";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "تنظیمات" }],
  }),
  component: SettingsPage,
});

/* =========================================================
   MetaTrader
========================================================= */

const EA_DOWNLOAD_URL = "";

function MetaTraderSettings() {
  const [status, setStatus] =
    useState<MetaTraderStatus | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

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

      {/* ===================================================
          Header
      =================================================== */}

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

      {/* ===================================================
          Loading
      =================================================== */}

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

      {/* ===================================================
          Error
      =================================================== */}

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

      {/* ===================================================
          Status
      =================================================== */}

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

            {/* Connected account information */}

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

          {/* =================================================
              API Key
          ================================================= */}

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
                  این کلید برای اتصال Expert Advisor به حساب شماست.
                  آن را فقط داخل MetaTrader خودتان وارد کنید و در اختیار افراد دیگر قرار ندهید.
                </p>
              </div>
            </div>

          </div>

          {/* =================================================
              Installation Guide
          ================================================= */}

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

            <div className="mt-6 space-y-4">

              {/* Step 1 */}

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

              {/* Step 2 */}

              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۲
                </div>

                <div>
                  <div className="font-medium">
                    Expert Advisor را دانلود کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    فایل EA مخصوص اتصال TraderJournal را دانلود کنید.
                  </p>

                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!EA_DOWNLOAD_URL}
                      onClick={() => {
                        if (!EA_DOWNLOAD_URL) {
                          return;
                        }

                        window.open(
                          EA_DOWNLOAD_URL,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                    >
                      <Download className="ml-2 h-4 w-4" />

                      {EA_DOWNLOAD_URL
                        ? "دانلود Expert Advisor"
                        : "لینک دانلود هنوز اضافه نشده"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}

              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۳
                </div>

                <div>
                  <div className="font-medium">
                    EA را داخل MetaTrader اجرا کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    فایل دانلودشده را روی یک Chart در MetaTrader بکشید
                    یا روی آن دوبار کلیک کنید.
                  </p>
                </div>
              </div>

              {/* Step 4 */}

              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۴
                </div>

                <div>
                  <div className="font-medium">
                    API Key را وارد کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در پنجره تنظیمات EA، وارد بخش{" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      Inputs
                    </span>{" "}
                    شوید و API Key را داخل فیلد{" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      ApiKey
                    </span>{" "}
                    قرار دهید.
                  </p>
                </div>
              </div>

              {/* Step 5 */}

              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۵
                </div>

                <div>
                  <div className="font-medium">
                    اجازه اجرای معاملات را فعال کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    در تب{" "}
                    <span
                      dir="ltr"
                      className="font-mono text-foreground"
                    >
                      Common
                    </span>{" "}
                    گزینه{" "}
                    <span className="font-medium text-foreground">
                      Allow live trading
                    </span>{" "}
                    را فعال کرده و روی OK بزنید.
                  </p>
                </div>
              </div>

              {/* Step 6 */}

              <div className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ۶
                </div>

                <div>
                  <div className="font-medium">
                    در صورت نیاز WebRequest را فعال کنید
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    اگر MetaTrader برای اتصال درخواست اجازه کرد، از مسیر
                    زیر آدرس اعلام‌شده توسط تیم بک‌اند را در لیست مجاز
                    WebRequest اضافه کنید:
                  </p>

                  <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                    <div
                      dir="ltr"
                      className="text-xs leading-6 text-muted-foreground"
                    >
                      Tools → Options → Expert Advisors
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      سپس گزینه{" "}
                      <span className="font-medium text-foreground">
                        Allow WebRequest for listed URL
                      </span>{" "}
                      را فعال کنید.
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* =================================================
              Connection Explanation
          ================================================= */}

          {!isConnected && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                <div>
                  <div className="font-semibold">
                    حساب هنوز متصل نشده است
                  </div>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    ابتدا Expert Advisor را روی MetaTrader نصب کنید،
                    API Key بالا را در قسمت ApiKey وارد کنید و سپس
                    متاتریدر را باز نگه دارید. بعد از آن روی
                    «بروزرسانی وضعیت» کلیک کنید.
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
   Settings Page
========================================================= */

function SettingsPage() {
  return (
    <AppShell
      title="تنظیمات"
      subtitle="مدیریت حساب، اشتراک و اتصالات"
    >
      <Tabs defaultValue="profile" dir="rtl">

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

            <div className="flex items-center gap-4">

              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/20 text-lg font-bold text-primary">
                  ع.ر
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold">
                  علی رضایی
                </div>

                <div className="text-sm text-muted-foreground">
                  ali@example.com
                </div>
              </div>

              <Button
                variant="outline"
                className="mr-auto"
              >
                تغییر عکس
              </Button>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="space-y-2">
                <Label>نام</Label>

                <Input
                  defaultValue="علی"
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label>نام خانوادگی</Label>

                <Input
                  defaultValue="رضایی"
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label>ایمیل</Label>

                <Input
                  defaultValue="ali@example.com"
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label>موبایل</Label>

                <Input
                  defaultValue="09123456789"
                  className="bg-secondary/60 tabular"
                />
              </div>

            </div>

            <div className="mt-6">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                ذخیره تغییرات
              </Button>
            </div>

          </div>
        </TabsContent>

        {/* =================================================
            Subscription
        ================================================= */}

        <TabsContent
          value="subscription"
          className="mt-6"
        >
          <div className="grid gap-4 lg:grid-cols-3">

            <div className="card-surface p-6 lg:col-span-2">

              <div className="flex items-center justify-between">

                <div>
                  <div className="text-sm text-muted-foreground">
                    اشتراک فعلی
                  </div>

                  <div className="mt-1 text-2xl font-bold">
                    Pro Max
                  </div>
                </div>

                <Badge className="bg-primary text-primary-foreground">
                  فعال
                </Badge>

              </div>

              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">

                <div>
                  <div className="text-muted-foreground">
                    شروع
                  </div>

                  <div className="mt-1 tabular">
                    ۱۴۰۳/۰۷/۰۱
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground">
                    پایان
                  </div>

                  <div className="mt-1 tabular">
                    ۱۴۰۳/۰۸/۰۱
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground">
                    مبلغ ماهانه
                  </div>

                  <div className="mt-1 tabular">
                    ۲,۰۰۰,۰۰۰ تومان
                  </div>
                </div>

              </div>

              <div className="mt-6 flex gap-2">

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  تمدید اشتراک
                </Button>

                <Button variant="outline">
                  مشاهده فاکتورها
                </Button>

              </div>

            </div>

            <div className="card-surface p-6">

              <div className="font-semibold">
                کد تخفیف
              </div>

              <div className="mt-3 flex gap-2">

                <Input
                  placeholder="کد را وارد کنید"
                  className="bg-secondary/60"
                />

                <Button variant="outline">
                  اعمال
                </Button>

              </div>

              <div className="mt-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <CheckCircle2 className="ml-1 inline h-4 w-4" />
                پرداخت از طریق زرین‌پال
              </div>

            </div>

          </div>
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