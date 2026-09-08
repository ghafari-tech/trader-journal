import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { getCalendar, type CalendarDay, type CalendarResponse } from "@/api/calendar";
import { getAccessToken } from "@/lib/auth-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({ meta: [{ title: "تقویم معاملاتی" }] }),
  component: CalendarPage,
});

const ACTIVE_PORTFOLIO_STORAGE_KEY = "traderjournal-active-portfolio";

const ACTIVE_PORTFOLIO_CHANGED_EVENT =
  "traderjournal-active-portfolio-changed";

const weekdays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const jalaliMonthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function getActivePortfolioId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACTIVE_PORTFOLIO_STORAGE_KEY);
}

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMoney(value: number): string {
  const amount = toNumber(value);

  return `${amount >= 0 ? "+" : "-"}$${formatNumber(Math.abs(amount))}`;
}

/**
 * تبدیل تاریخ جلالی به میلادی
 * برای به‌دست آوردن روز هفته در تقویم.
 */
function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number,
): {
  gy: number;
  gm: number;
  gd: number;
} {
  let jy2 = jy - 979;

  let days =
    365 * jy2 +
    Math.floor(jy2 / 33) * 8 +
    Math.floor(((jy2 % 33) + 3) / 4);

  for (let i = 0; i < jm - 1; i += 1) {
    days += i < 6 ? 31 : 30;
  }

  days += jd - 1;

  let gy = 1600 + 400 * Math.floor(days / 146097);

  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);

    days %= 36524;

    if (days >= 365) {
      days += 1;
    }
  }

  gy += 4 * Math.floor(days / 1461);

  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);

    days = (days - 1) % 365;
  }

  const gd = days + 1;

  const isLeapYear =
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;

  const monthDays = [
    0,
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let gm = 1;
  let remainingDays = gd;

  while (remainingDays > monthDays[gm]) {
    remainingDays -= monthDays[gm];
    gm += 1;
  }

  return {
    gy,
    gm,
    gd: remainingDays,
  };
}

/**
 * چون getUTCDay:
 * یکشنبه = 0
 * دوشنبه = 1
 * ...
 * شنبه = 6
 *
 * اما تقویم ما از شنبه شروع می‌شود.
 */
function getSaturdayFirstWeekday(
  year: number,
  month: number,
  day: number,
): number {
  const gregorian = jalaliToGregorian(year, month, day);

  const date = new Date(
    Date.UTC(gregorian.gy, gregorian.gm - 1, gregorian.gd),
  );

  return (date.getUTCDay() + 1) % 7;
}

function parseJalaliDate(dateString: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const match = dateString.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
  };
}

function getMonthTitle(calendar: CalendarDay[]): string {
  if (!calendar.length) {
    return "تقویم معاملاتی";
  }

  const parsed = parseJalaliDate(calendar[0].date);

  if (!parsed) {
    return "تقویم معاملاتی";
  }

  const monthName = jalaliMonthNames[parsed.month - 1] ?? "";

  return `${monthName} ${parsed.year.toLocaleString("fa-IR")}`;
}

function getIntensity(profitLoss: number): number {
  const amount = Math.abs(profitLoss);

  if (amount === 0) {
    return 0;
  }

  return Math.min(amount / 800, 1);
}

function CalendarPage() {
  const [calendarData, setCalendarData] =
    useState<CalendarResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [activePortfolioId, setActivePortfolioId] =
    useState<string | null>(null);

  const loadCalendar = useCallback(async () => {
    const portfolioId = getActivePortfolioId();

    setActivePortfolioId(portfolioId);

    if (!portfolioId) {
      setCalendarData(null);
      setError("هیچ پرتفولیوی فعالی انتخاب نشده است.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const token = getAccessToken();

    if (!token) {
      setCalendarData(null);
      setError("نشست کاربری شما منقضی شده است. لطفاً دوباره وارد شوید.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);

      const data = await getCalendar();

      setCalendarData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "خطا در دریافت تقویم معاملاتی";

      setError(message);
      setCalendarData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    const handlePortfolioChanged = () => {
      setLoading(true);
      void loadCalendar();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACTIVE_PORTFOLIO_STORAGE_KEY) {
        handlePortfolioChanged();
      }
    };

    window.addEventListener(
      ACTIVE_PORTFOLIO_CHANGED_EVENT,
      handlePortfolioChanged,
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        ACTIVE_PORTFOLIO_CHANGED_EVENT,
        handlePortfolioChanged,
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, [loadCalendar]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCalendar();
  };

  const calendarDays = calendarData?.calendar ?? [];

  const monthTitle = useMemo(
    () => getMonthTitle(calendarDays),
    [calendarDays],
  );

  const firstDayOffset = useMemo(() => {
    if (!calendarDays.length) {
      return 0;
    }

    const firstDate = parseJalaliDate(calendarDays[0].date);

    if (!firstDate) {
      return 0;
    }

    return getSaturdayFirstWeekday(
      firstDate.year,
      firstDate.month,
      firstDate.day,
    );
  }, [calendarDays]);

  const calendarCells = useMemo(() => {
    const cells: Array<CalendarDay | null> = [];

    for (let i = 0; i < firstDayOffset; i += 1) {
      cells.push(null);
    }

    for (const day of calendarDays) {
      cells.push(day);
    }

    return cells;
  }, [calendarDays, firstDayOffset]);

  const totalMonth = toNumber(calendarData?.total_month);

  const profitableDays = toNumber(calendarData?.profitable_days);

  const lossDays = toNumber(calendarData?.loss_days);

  const bestDay = toNumber(calendarData?.best_day);

  return (
    <AppShell
      title="تقویم معاملاتی"
      subtitle={
        activePortfolioId
          ? `نقشه رنگی روزهای سودده و زیان‌ده — ${monthTitle}`
          : "نقشه رنگی روزهای سودده و زیان‌ده"
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled
            title="دریافت ماه قبل توسط API فعلی پشتیبانی نمی‌شود"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="min-w-28 text-center font-medium">
            {monthTitle}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled
            title="دریافت ماه بعد توسط API فعلی پشتیبانی نمی‌شود"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            title="به‌روزرسانی"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      }
    >
      {!activePortfolioId && !loading ? (
        <div className="card-surface p-6 text-center">
          <div className="text-sm text-muted-foreground">
            هیچ پرتفولیوی فعالی انتخاب نشده است.
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            ابتدا یک پرتفولیو را انتخاب کنید تا تقویم معاملاتی آن نمایش داده
            شود.
          </div>
        </div>
      ) : null}

      {error && activePortfolioId ? (
        <div className="card-surface p-6">
          <div className="text-sm font-medium text-destructive">
            خطا در دریافت تقویم معاملاتی
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            {error}
          </div>

          <Button
            variant="outline"
            className="mt-4"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال دریافت...
              </>
            ) : (
              <>
                <RefreshCw className="ml-2 h-4 w-4" />
                تلاش مجدد
              </>
            )}
          </Button>
        </div>
      ) : null}

      {loading ? (
        <div className="card-surface flex min-h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال دریافت تقویم معاملاتی...
          </div>
        </div>
      ) : null}

      {!loading && !error && activePortfolioId && calendarData ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                مجموع ماه
              </div>

              <div
                className={`mt-2 text-2xl font-bold tabular ${
                  totalMonth >= 0 ? "gain" : "loss"
                }`}
              >
                {formatMoney(totalMonth)}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                روزهای سودده
              </div>

              <div className="mt-2 text-2xl font-bold tabular gain">
                {profitableDays.toLocaleString("fa-IR")}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                روزهای زیان‌ده
              </div>

              <div className="mt-2 text-2xl font-bold tabular loss">
                {lossDays.toLocaleString("fa-IR")}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                بهترین روز
              </div>

              <div
                className={`mt-2 text-2xl font-bold tabular ${
                  bestDay >= 0 ? "gain" : "loss"
                }`}
              >
                {formatMoney(bestDay)}
              </div>
            </div>
          </div>

          <div className="card-surface mt-6 p-6">
            {calendarDays.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
                برای پرتفولیوی انتخاب‌شده اطلاعاتی برای تقویم معاملاتی وجود
                ندارد.
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-medium">
                    {monthTitle}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.55_0.12_155)]" />
                      سود
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.55_0.12_25)]" />
                      ضرر
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekdays.map((weekday) => (
                    <div
                      key={weekday}
                      className="pb-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {weekday}
                    </div>
                  ))}

                  {calendarCells.map((calendarDay, index) => {
                    if (!calendarDay) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square"
                        />
                      );
                    }

                    const profitLoss = toNumber(
                      calendarDay.profit_loss,
                    );

                    const transactionsCount = toNumber(
                      calendarDay.transactions_count,
                    );

                    const parsedDate = parseJalaliDate(
                      calendarDay.date,
                    );

                    const dayNumber = parsedDate?.day ?? "";

                    const intensity = getIntensity(profitLoss);

                    const background =
                      profitLoss > 0
                        ? `oklch(0.4 ${
                            0.1 * intensity + 0.05
                          } 155 / ${0.3 + intensity * 0.5})`
                        : profitLoss < 0
                          ? `oklch(0.4 ${
                              0.15 * intensity + 0.05
                            } 25 / ${0.3 + intensity * 0.5})`
                          : "oklch(0.22 0.02 255)";

                    return (
                      <div
                        key={calendarDay.date}
                        className="aspect-square rounded-lg border border-border p-2 transition-all hover:scale-[1.02] hover:border-primary/50"
                        style={{
                          background,
                        }}
                        title={`${calendarDay.date} — ${formatMoney(
                          profitLoss,
                        )} — ${transactionsCount.toLocaleString(
                          "fa-IR",
                        )} معامله`}
                      >
                        <div className="text-xs text-foreground/80 tabular">
                          {String(dayNumber).replace(
                            /\d/g,
                            (digit) =>
                              "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit,
                          )}
                        </div>

                        {profitLoss !== 0 ? (
                          <>
                            <div
                              className={`mt-2 text-xs font-bold tabular ${
                                profitLoss > 0 ? "gain" : "loss"
                              }`}
                            >
                              {formatMoney(profitLoss)}
                            </div>

                            <div className="mt-0.5 text-[10px] text-muted-foreground">
                              {transactionsCount.toLocaleString(
                                "fa-IR",
                              )}{" "}
                              معامله
                            </div>
                          </>
                        ) : transactionsCount > 0 ? (
                          <div className="mt-2 text-[10px] text-muted-foreground">
                            {transactionsCount.toLocaleString(
                              "fa-IR",
                            )}{" "}
                            معامله
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
    </AppShell>
  );
}