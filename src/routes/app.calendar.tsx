
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
  getCalendar,
  type CalendarDay,
  type CalendarResponse,
} from "@/api/calendar";

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

function getActivePortfolioId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(
    ACTIVE_PORTFOLIO_STORAGE_KEY,
  );

  return value && value.trim()
    ? value
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

function parseGregorianDate(
  dateString: string,
): {
  year: number;
  month: number;
  day: number;
} | null {
  const match =
    dateString.match(
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
    );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
  };
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
 * JavaScript:
 * Sunday = 0
 * Monday = 1
 * ...
 * Saturday = 6
 *
 * تقویم UI از شنبه شروع می‌شود:
 * Saturday = 0
 * Sunday = 1
 * ...
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

function getIntensity(
  profitLoss: number,
): number {
  const amount = Math.abs(
    profitLoss,
  );

  if (amount === 0) {
    return 0;
  }

  return Math.min(
    amount / 800,
    1,
  );
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
    calendarData,
    setCalendarData,
  ] = useState<CalendarResponse | null>(
    null,
  );

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
  ] = useState<string | null>(
    null,
  );

  const loadCalendar =
    useCallback(
      async (
        year: number,
        month: number,
        isRefresh = false,
      ) => {
        const portfolioId =
          getActivePortfolioId();

        setActivePortfolioId(
          portfolioId,
        );

        if (!portfolioId) {
          setCalendarData(null);
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
           * selectedYear / selectedMonth شمسی هستند.
           * API همچنان سال و ماه میلادی می‌خواهد.
           */
          const [
            gregorianYear,
            gregorianMonth,
          ] = jalaliToGregorian(
            year,
            month,
            1,
          );

          const data =
            await getCalendar(
              gregorianYear,
              gregorianMonth,
            );

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
      },
      [],
    );

  useEffect(() => {
    void loadCalendar(
      selectedYear,
      selectedMonth,
    );
  }, [
    selectedYear,
    selectedMonth,
    loadCalendar,
  ]);

  useEffect(() => {
    const handlePortfolioChanged =
      () => {
        const portfolioId =
          getActivePortfolioId();

        setActivePortfolioId(
          portfolioId,
        );

        if (!portfolioId) {
          setCalendarData(null);
          setError(
            "هیچ پرتفولیوی فعالی انتخاب نشده است.",
          );
          setLoading(false);
          return;
        }

        void loadCalendar(
          selectedYear,
          selectedMonth,
        );
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
  }, [
    loadCalendar,
    selectedYear,
    selectedMonth,
  ]);

  const handleRefresh =
    async () => {
      await loadCalendar(
        selectedYear,
        selectedMonth,
        true,
      );

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

    setSelectedYear(nextYear);
    setSelectedMonth(nextMonth);
  };

  const calendarDays =
    calendarData?.calendar ?? [];

  const monthTitle =
    getMonthTitle(
      selectedYear,
      selectedMonth,
    );

  const firstDayOffset =
    useMemo(() => {
      if (!calendarDays.length) {
        return 0;
      }

      const firstDate =
        parseGregorianDate(
          calendarDays[0].date,
        );

      if (!firstDate) {
        return 0;
      }

      return getSaturdayFirstWeekday(
        firstDate.year,
        firstDate.month,
        firstDate.day,
      );
    }, [calendarDays]);

  const calendarCells =
    useMemo(() => {
      const cells: Array<
        CalendarDay | null
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

  const totalMonth = toNumber(
    calendarData?.total_month,
  );

  const profitableDays =
    toNumber(
      calendarData?.profitable_days,
    );

  const lossDays = toNumber(
    calendarData?.loss_days,
  );

  const bestDay = toNumber(
    calendarData?.best_day,
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
            خطا در دریافت تقویم معاملاتی
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
            در حال دریافت تقویم معاملاتی...
          </div>
        </div>
      ) : null}

      {!loading &&
      !error &&
      activePortfolioId &&
      calendarData ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                مجموع ماه
              </div>

              <div
                className={`mt-2 text-2xl font-bold tabular ${
                  totalMonth >= 0
                    ? "gain"
                    : "loss"
                }`}
              >
                {formatMoney(
                  totalMonth,
                )}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                روزهای سودده
              </div>

              <div className="mt-2 text-2xl font-bold tabular gain">
                {profitableDays.toLocaleString(
                  "fa-IR",
                )}
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="text-xs text-muted-foreground">
                روزهای زیان‌ده
              </div>

              <div className="mt-2 text-2xl font-bold tabular loss">
                {lossDays.toLocaleString(
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
                  bestDay >= 0
                    ? "gain"
                    : "loss"
                }`}
              >
                {formatMoney(bestDay)}
              </div>
            </div>
          </div>

          <div className="card-surface mt-6 p-6">
            {calendarDays.length ===
            0 ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
                برای این ماه اطلاعاتی برای
                تقویم معاملاتی وجود ندارد.
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

                      const parsedDate =
                        parseGregorianDate(
                          calendarDay.date,
                        );

                      const dayNumber =
                        parsedDate?.day ??
                        "";

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
                          key={
                            calendarDay.date
                          }
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
                            {toPersianDigits(
                              dayNumber,
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
              </>
            )}
          </div>
        </>
      ) : null}
    </AppShell>
  );
}
