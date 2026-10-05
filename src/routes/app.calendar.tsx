
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

import {
  getTrades,
  type Trade,
} from "@/api/trades";

import { toast } from "sonner";

export const Route = createFileRoute(
  "/app/calendar",
)({
  head: () => ({
    meta: [{ title: "تقویم معاملاتی" }],
  }),
  component: CalendarPage,
});

const ACTIVE_PORTFOLIO_STORAGE_KEY =
  "traderjournal-active-portfolio";

const ACTIVE_PORTFOLIO_CHANGED_EVENT =
  "traderjournal-active-portfolio-changed";

const weekdays = [
  "ش",
  "ی",
  "د",
  "س",
  "چ",
  "پ",
  "ج",
];

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

type DayData = {
  date: string;
  jalaliYear: number;
  jalaliMonth: number;
  jalaliDay: number;
  transactions_count: number;
  profit_loss: number;
};

type CalendarStats = {
  total_month: number;
  profitable_days: number;
  loss_days: number;
  best_day: number;
};

function getActivePortfolioId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(
    ACTIVE_PORTFOLIO_STORAGE_KEY,
  );

  return value && value.trim()
    ? value.trim()
    : null;
}

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatInteger(
  value: number,
): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

function formatMoney(
  value: number,
): string {
  const amount = toNumber(value);

  return `${amount >= 0 ? "+" : "-"}$${formatInteger(
    Math.abs(amount),
  )}`;
}

function toPersianDigits(
  value: string | number,
): string {
  return String(value).replace(
    /\d/g,
    (digit) =>
      "۰۱۲۳۴۵۶۷۸۹"[
        Number(digit)
      ] ?? digit,
  );
}

/**
 * تبدیل تاریخ میلادی به شمسی
 */
function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const gDaysInMonth = [
    31,
    28,
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

  const jDaysInMonth = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    29,
  ];

  const gy2 = gy - 1600;
  const gm2 = gm - 1;
  const gd2 = gd - 1;

  let gDayNo =
    365 * gy2 +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400);

  for (let i = 0; i < gm2; i += 1) {
    gDayNo += gDaysInMonth[i];
  }

  if (
    gm2 > 1 &&
    (gy % 4 === 0 &&
    gy % 100 !== 0
      ? true
      : gy % 400 === 0)
  ) {
    gDayNo += 1;
  }

  gDayNo += gd2;

  let jDayNo = gDayNo - 79;

  const jNp = Math.floor(
    jDayNo / 12053,
  );

  let jy = 979 + 33 * jNp;

  jDayNo %= 12053;

  jy +=
    4 *
    Math.floor(
      jDayNo / 1461,
    );

  jDayNo %= 1461;

  if (jDayNo >= 366) {
    jy += Math.floor(
      (jDayNo - 1) / 365,
    );

    jDayNo =
      (jDayNo - 1) % 365;
  }

  let jm = 0;

  while (
    jm < 11 &&
    jDayNo >= jDaysInMonth[jm]
  ) {
    jDayNo -=
      jDaysInMonth[jm];

    jm += 1;
  }

  const jd = jDayNo + 1;

  return [
    jy,
    jm + 1,
    jd,
  ];
}

/**
 * تبدیل تاریخ شمسی به میلادی
 */
function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number,
): [number, number, number] {
  const gDaysInMonth = [
    31,
    28,
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

  const jDaysInMonth = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    29,
  ];

  const jy2 = jy - 979;

  let jDayNo =
    365 * jy2 +
    Math.floor(jy2 / 33) * 8 +
    Math.floor(
      ((jy2 % 33) + 3) / 4,
    );

  for (
    let i = 0;
    i < jm - 1;
    i += 1
  ) {
    jDayNo +=
      jDaysInMonth[i];
  }

  jDayNo += jd - 1;

  let gDayNo = jDayNo + 79;

  let gy =
    1600 +
    400 *
      Math.floor(
        gDayNo / 146097,
      );

  gDayNo %= 146097;

  let leap = true;

  if (gDayNo >= 36525) {
    gDayNo -= 1;

    gy +=
      100 *
      Math.floor(
        gDayNo / 36524,
      );

    gDayNo %= 36524;

    if (gDayNo >= 365) {
      gDayNo += 1;
    } else {
      leap = false;
    }
  }

  gy +=
    4 *
    Math.floor(
      gDayNo / 1461,
    );

  gDayNo %= 1461;

  if (gDayNo >= 366) {
    leap = false;

    gDayNo -= 1;

    gy += Math.floor(
      gDayNo / 365,
    );

    gDayNo %= 365;
  }

  let gm = 0;

  while (
    gDayNo >=
    gDaysInMonth[gm] +
      (gm === 1 && leap ? 1 : 0)
  ) {
    gDayNo -=
      gDaysInMonth[gm] +
      (gm === 1 && leap ? 1 : 0);

    gm += 1;
  }

  const gd = gDayNo + 1;

  return [
    gy,
    gm + 1,
    gd,
  ];
}

/**
 * تعداد روزهای ماه شمسی
 */
function getJalaliMonthDays(
  year: number,
  month: number,
): number {
  if (month <= 6) {
    return 31;
  }

  if (month <= 11) {
    return 30;
  }

  const [, , day] =
    jalaliToGregorian(
      year,
      12,
      30,
    );

  const [
    nextYear,
    nextMonth,
    nextDay,
  ] = gregorianToJalali(
    ...jalaliToGregorian(
      year + 1,
      1,
      1,
    ),
  );

  void day;
  void nextYear;
  void nextMonth;
  void nextDay;

  const [
    gy,
    gm,
    gd,
  ] = jalaliToGregorian(
    year,
    12,
    29,
  );

  const [
    jy,
    jm,
    jd,
  ] = gregorianToJalali(
    gy,
    gm,
    gd,
  );

  if (
    jy === year &&
    jm === 12 &&
    jd === 29
  ) {
    return 30;
  }

  return 29;
}

/**
 * تشخیص روز هفته.
 *
 * شنبه = 0
 * یکشنبه = 1
 * ...
 * جمعه = 6
 */
function getSaturdayFirstWeekday(
  year: number,
  month: number,
  day: number,
): number {
  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  return (
    (date.getUTCDay() + 1) % 7
  );
}

/**
 * تبدیل تاریخ معامله به یک Date معتبر
 */
function parseTradeDate(
  value: string | null | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date;
}

/**
 * کل معاملات پرتفولیوی فعال را دریافت می‌کند.
 *
 * مهم:
 * getTrades خودش از backend معاملات پرتفولیوی فعال
 * را برمی‌گرداند؛ بنابراین تقویم دقیقاً روی همان منبع
 * داده‌ای ساخته می‌شود که صفحه «معاملات» استفاده می‌کند.
 */
async function getAllTrades(): Promise<
  Trade[]
> {
  const allTrades: Trade[] = [];

  let page = 1;

  while (true) {
    const response =
      await getTrades(page);

    const pageTrades =
      response.results?.transactions ??
      [];

    allTrades.push(
      ...pageTrades,
    );

    if (!response.next) {
      break;
    }

    page += 1;

    /*
     * جلوگیری از حلقه بی‌نهایت در صورت
     * خراب بودن pagination سمت backend.
     */
    if (page > 1000) {
      break;
    }
  }

  return allTrades;
}

/**
 * تاریخ معامله را دقیقاً با همان منطق صفحه معاملات
 * مشخص می‌کند:
 *
 * closed_at → created_at
 */
function getTradeDate(
  trade: Trade,
): Date | null {
  return parseTradeDate(
    trade.closed_at ??
      trade.created_at,
  );
}

function buildCalendarForMonth(
  trades: Trade[],
  jalaliYear: number,
  jalaliMonth: number,
): {
  days: DayData[];
  stats: CalendarStats;
} {
  const daysMap =
    new Map<string, DayData>();

  /*
   * همه روزهای ماه را از قبل می‌سازیم.
   * بنابراین حتی اگر backend فقط روزهای دارای معامله
   * را برگرداند، ساختار تقویم هیچ‌وقت به‌هم نمی‌ریزد.
   */
  const monthDays =
    getJalaliMonthDays(
      jalaliYear,
      jalaliMonth,
    );

  for (
    let day = 1;
    day <= monthDays;
    day += 1
  ) {
    const [
      gy,
      gm,
      gd,
    ] = jalaliToGregorian(
      jalaliYear,
      jalaliMonth,
      day,
    );

    const key = `${jalaliYear}/${jalaliMonth}/${day}`;

    daysMap.set(
      key,
      {
        date: `${gy}/${gm}/${gd}`,
        jalaliYear,
        jalaliMonth,
        jalaliDay: day,
        transactions_count: 0,
        profit_loss: 0,
      },
    );
  }

  /*
   * تمام معاملات پرتفولیوی فعال را
   * در روز شمسی صحیح خود قرار می‌دهیم.
   */
  for (const trade of trades) {
    const date =
      getTradeDate(trade);

    if (!date) {
      continue;
    }

    const [
      jy,
      jm,
      jd,
    ] = gregorianToJalali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    if (
      jy !== jalaliYear ||
      jm !== jalaliMonth
    ) {
      continue;
    }

    const key = `${jy}/${jm}/${jd}`;

    const current =
      daysMap.get(key);

    if (!current) {
      continue;
    }

    current.transactions_count += 1;

    current.profit_loss +=
      toNumber(
        trade.profit_loss,
      );
  }

  const days = Array.from(
    daysMap.values(),
  );

  const tradingDays =
    days.filter(
      (day) =>
        day.transactions_count > 0,
    );

  const totalMonth =
    tradingDays.reduce(
      (sum, day) =>
        sum + day.profit_loss,
      0,
    );

  const profitableDays =
    tradingDays.filter(
      (day) =>
        day.profit_loss > 0,
    ).length;

  const lossDays =
    tradingDays.filter(
      (day) =>
        day.profit_loss < 0,
    ).length;

  const bestDay =
    tradingDays.length > 0
      ? Math.max(
          ...tradingDays.map(
            (day) =>
              day.profit_loss,
          ),
        )
      : 0;

  return {
    days,
    stats: {
      total_month:
        totalMonth,
      profitable_days:
        profitableDays,
      loss_days:
        lossDays,
      best_day:
        bestDay,
    },
  };
}

function getIntensity(
  profitLoss: number,
): number {
  const amount =
    Math.abs(profitLoss);

  if (amount === 0) {
    return 0;
  }

  return Math.min(
    amount / 800,
    1,
  );
}

function getMonthTitle(
  year: number,
  month: number,
): string {
  const monthName =
    jalaliMonthNames[
      month - 1
    ] ?? "";

  return `${monthName} ${toPersianDigits(
    year,
  )}`;
}

function CalendarPage() {
  const today = new Date();

  const [
    todayJalaliYear,
    todayJalaliMonth,
  ] = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  const [
    selectedYear,
    setSelectedYear,
  ] = useState(
    todayJalaliYear,
  );

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState(
    todayJalaliMonth,
  );

  const [
    trades,
    setTrades,
  ] = useState<Trade[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    activePortfolioId,
    setActivePortfolioId,
  ] = useState<
    string | null
  >(null);

  const loadTrades =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        const portfolioId =
          getActivePortfolioId();

        setActivePortfolioId(
          portfolioId,
        );

        if (!portfolioId) {
          setTrades([]);
          setError(
            "هیچ پرتفولیوی فعالی انتخاب نشده است.",
          );
          setLoading(false);
          setRefreshing(false);
          return;
        }

        try {
          setError(null);

          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          /*
           * getTrades از backend معاملات
           * پرتفولیوی فعال را دریافت می‌کند.
           *
           * همه صفحات را می‌گیریم تا هیچ معامله‌ای
           * به خاطر pagination از تقویم حذف نشود.
           */
          const allTrades =
            await getAllTrades();

          setTrades(allTrades);
        } catch (err) {
          console.error(
            "Failed to load calendar trades:",
            err,
          );

          const message =
            err instanceof Error
              ? err.message
              : "دریافت معاملات برای تقویم با خطا مواجه شد.";

          setError(message);
          setTrades([]);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadTrades();
  }, [loadTrades]);

  useEffect(() => {
    const handlePortfolioChanged =
      () => {
        void loadTrades();
      };

    const handleStorage = (
      event: StorageEvent,
    ) => {
      if (
        event.key ===
        ACTIVE_PORTFOLIO_STORAGE_KEY
      ) {
        handlePortfolioChanged();
      }
    };

    window.addEventListener(
      ACTIVE_PORTFOLIO_CHANGED_EVENT,
      handlePortfolioChanged,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        ACTIVE_PORTFOLIO_CHANGED_EVENT,
        handlePortfolioChanged,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, [loadTrades]);

  const handleRefresh =
    async () => {
      await loadTrades(true);

      toast.success(
        "تقویم به‌روزرسانی شد",
      );
    };

  const changeMonth = (
    direction: number,
  ) => {
    let nextMonth =
      selectedMonth + direction;

    let nextYear =
      selectedYear;

    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    setSelectedYear(
      nextYear,
    );

    setSelectedMonth(
      nextMonth,
    );
  };

  const {
    days: calendarDays,
    stats,
  } = useMemo(
    () =>
      buildCalendarForMonth(
        trades,
        selectedYear,
        selectedMonth,
      ),
    [
      trades,
      selectedYear,
      selectedMonth,
    ],
  );

  const [
    firstDayOffset,
    setFirstDayOffset,
  ] = useState(0);

  useEffect(() => {
    const [
      gy,
      gm,
      gd,
    ] = jalaliToGregorian(
      selectedYear,
      selectedMonth,
      1,
    );

    setFirstDayOffset(
      getSaturdayFirstWeekday(
        gy,
        gm,
        gd,
      ),
    );
  }, [
    selectedYear,
    selectedMonth,
  ]);

  const calendarCells =
    useMemo(() => {
      const cells: Array<
        DayData | null
      > = [];

      for (
        let index = 0;
        index < firstDayOffset;
        index += 1
      ) {
        cells.push(null);
      }

      for (const day of calendarDays) {
        cells.push(day);
      }

      return cells;
    }, [
      calendarDays,
      firstDayOffset,
    ]);

  const monthTitle =
    getMonthTitle(
      selectedYear,
      selectedMonth,
    );

  return (
    <AppShell
      title="تقویم معاملاتی"
      subtitle={
        activePortfolioId
          ? `نقشه روزهای سودده و زیان‌ده — ${monthTitle}`
          : "نقشه روزهای سودده و زیان‌ده"
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              changeMonth(-1)
            }
            disabled={
              loading ||
              refreshing
            }
            title="ماه قبل"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="min-w-28 text-center font-medium">
            {monthTitle}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              changeMonth(1)
            }
            disabled={
              loading ||
              refreshing
            }
            title="ماه بعد"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={
              handleRefresh
            }
            disabled={
              loading ||
              refreshing
            }
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
      {!activePortfolioId &&
      !loading ? (
        <div className="card-surface p-6 text-center">
          <div className="text-sm text-muted-foreground">
            هیچ پرتفولیوی فعالی انتخاب نشده
            است.
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            ابتدا یک پرتفولیو را انتخاب کنید
            تا تقویم معاملاتی آن نمایش داده
            شود.
          </div>
        </div>
      ) : null}

      {error &&
      activePortfolioId ? (
        <div className="card-surface p-6">
          <div className="text-sm font-medium text-destructive">
            دریافت تقویم معاملاتی انجام نشد
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            {error}
          </div>

          <Button
            variant="outline"
            className="mt-4"
            onClick={
              handleRefresh
            }
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
            در حال دریافت معاملات پرتفولیوی فعال...
          </div>
        </div>
      ) : null}

      {!loading &&
      !error &&
      activePortfolioId ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                مجموع ماه
              </div>

              <div
                className={`mt-2 text-2xl font-bold tabular ${
                  stats.total_month >= 0
                    ? "gain"
                    : "loss"
                }`}
              >
                {formatMoney(
                  stats.total_month,
                )}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                روزهای سودده
              </div>

              <div className="mt-2 text-2xl font-bold tabular gain">
                {stats.profitable_days.toLocaleString(
                  "fa-IR",
                )}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                روزهای زیان‌ده
              </div>

              <div className="mt-2 text-2xl font-bold tabular loss">
                {stats.loss_days.toLocaleString(
                  "fa-IR",
                )}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                بهترین روز
              </div>

              <div
                className={`mt-2 text-2xl font-bold tabular ${
                  stats.best_day >= 0
                    ? "gain"
                    : "loss"
                }`}
              >
                {formatMoney(
                  stats.best_day,
                )}
              </div>
            </div>
          </div>

          <div className="card-surface mt-6 p-6">
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
              {weekdays.map(
                (weekday) => (
                  <div
                    key={weekday}
                    className="pb-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {weekday}
                  </div>
                ),
              )}

              {calendarCells.map(
                (
                  calendarDay,
                  index,
                ) => {
                  if (
                    !calendarDay
                  ) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square"
                      />
                    );
                  }

                  const profitLoss =
                    toNumber(
                      calendarDay.profit_loss,
                    );

                  const transactionsCount =
                    toNumber(
                      calendarDay.transactions_count,
                    );

                  const intensity =
                    getIntensity(
                      profitLoss,
                    );

                  let background =
                    "oklch(0.22 0.02 255)";

                  if (
                    profitLoss > 0
                  ) {
                    background = `oklch(0.4 ${
                      0.1 *
                        intensity +
                      0.05
                    } 155 / ${
                      0.3 +
                      intensity *
                        0.5
                    })`;
                  } else if (
                    profitLoss < 0
                  ) {
                    background = `oklch(0.4 ${
                      0.15 *
                        intensity +
                      0.05
                    } 25 / ${
                      0.3 +
                      intensity *
                        0.5
                    })`;
                  }

                  return (
                    <div
                      key={`${calendarDay.jalaliYear}-${calendarDay.jalaliMonth}-${calendarDay.jalaliDay}`}
                      className="aspect-square rounded-lg border border-border p-2 transition-all hover:scale-[1.02] hover:border-primary/50"
                      style={{
                        background,
                      }}
                      title={`${calendarDay.jalaliYear}/${calendarDay.jalaliMonth}/${calendarDay.jalaliDay} — ${formatMoney(
                        profitLoss,
                      )} — ${transactionsCount.toLocaleString(
                        "fa-IR",
                      )} معامله`}
                    >
                      <div className="text-xs text-foreground/80 tabular">
                        {toPersianDigits(
                          calendarDay.jalaliDay,
                        )}
                      </div>

                      {profitLoss !==
                      0 ? (
                        <>
                          <div
                            className={`mt-2 text-xs font-bold tabular ${
                              profitLoss >
                              0
                                ? "gain"
                                : "loss"
                            }`}
                          >
                            {formatMoney(
                              profitLoss,
                            )}
                          </div>

                          <div className="mt-0.5 text-[10px] text-muted-foreground">
                            {transactionsCount.toLocaleString(
                              "fa-IR",
                            )}{" "}
                            معامله
                          </div>
                        </>
                      ) : transactionsCount >
                        0 ? (
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {transactionsCount.toLocaleString(
                            "fa-IR",
                          )}{" "}
                          معامله
                        </div>
                      ) : null}
                    </div>
                  );
                },
              )}
            </div>

            {trades.length ===
            0 ? (
              <div className="mt-6 flex min-h-32 items-center justify-center rounded-lg border border-border bg-secondary/20 text-sm text-muted-foreground">
                برای این پرتفولیو هیچ معامله‌ای
                ثبت نشده است.
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </AppShell>
  );
}

