import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Percent,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
  Loader2,
  BarChart3,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/api/client";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [{ title: "داشبورد — TraderJournal" }],
  }),
  component: DashboardPage,
});

/* =========================
   Types
========================= */

type SummaryTransaction = {
  symbol: string;
  transaction_type: "buy" | "sell" | string;
  volume: string | number | null;
  r_r: string | number | null;
  total_reward: number | null;
  created_at: string | null;
};

type BestWorstTransaction = {
  symbol: string | null;
  total_reward: number | null;
  r_r: string | number | null;
  created_at: string | null;
};

type SummaryResponse = {
  total_reward: number | null;
  total_profit: number | null;
  total_loss: number | null;
  total_trades: number | null;
  winning_trades: number | null;
  losing_trades: number | null;
  win_rate: number | null;
  profit_factor: number | null;
  max_drawdown: number | null;
  best_transaction: BestWorstTransaction | null;
  worst_transaction: BestWorstTransaction | null;
  transactions: SummaryTransaction[] | null;
};

/* =========================
   Equity API
========================= */

type EquityItem = {
  date: string;
  equity: number | null;
};

type EquityResponse = {
  start_date?: string | null;
  end_date?: string | null;
  data?: EquityItem[] | null;
} | EquityItem[];

/* =========================
   Drawdown
========================= */

type DrawdownItem = {
  date: string;
  dd: number | null;
};

/* =========================
   Monthly
========================= */

type MonthlyItem = {
  month: string;
  month_number: number;
  profit: number | null;
  loss: number | null;
  net: number | null;
};

type MonthlyResponse = {
  year: number | null;
  months: MonthlyItem[] | null;
};

/* =========================
   Win / Loss
========================= */

type WinLossResponse = {
  total_trades: number | null;
  winning_trades: number | null;
  losing_trades: number | null;
  break_even_trades: number | null;
  win_rate: number | null;
  loss_rate: number | null;
};

/* =========================
   Safe Helpers
========================= */

function toSafeNumber(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : fallback;
  }

  return fallback;
}

function toSafeString(
  value: unknown,
  fallback = "—",
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}

function normalizeSummary(
  value: SummaryResponse | null | undefined,
): SummaryResponse {
  const source = value ?? ({} as SummaryResponse);

  return {
    total_reward: toSafeNumber(
      source.total_reward,
    ),

    total_profit: toSafeNumber(
      source.total_profit,
    ),

    total_loss: toSafeNumber(
      source.total_loss,
    ),

    total_trades: toSafeNumber(
      source.total_trades,
    ),

    winning_trades: toSafeNumber(
      source.winning_trades,
    ),

    losing_trades: toSafeNumber(
      source.losing_trades,
    ),

    win_rate: toSafeNumber(
      source.win_rate,
    ),

    profit_factor: toSafeNumber(
      source.profit_factor,
    ),

    max_drawdown: toSafeNumber(
      source.max_drawdown,
    ),

    best_transaction:
      source.best_transaction ?? null,

    worst_transaction:
      source.worst_transaction ?? null,

    transactions: Array.isArray(
      source.transactions,
    )
      ? source.transactions
      : [],
  };
}

function normalizeEquity(
  value: EquityResponse | null | undefined,
): EquityItem[] {
  if (Array.isArray(value)) {
    return value.map((item) => ({
      date: toSafeString(item?.date, ""),
      equity: toSafeNumber(item?.equity),
    }));
  }

  if (
    value &&
    Array.isArray(value.data)
  ) {
    return value.data.map((item) => ({
      date: toSafeString(item?.date, ""),
      equity: toSafeNumber(item?.equity),
    }));
  }

  return [];
}

function normalizeDrawdown(
  value: DrawdownItem[] | null | undefined,
): DrawdownItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => ({
    date: toSafeString(item?.date, ""),
    dd: toSafeNumber(item?.dd),
  }));
}

function normalizeMonthly(
  value: MonthlyResponse | null | undefined,
): MonthlyResponse {
  if (!value) {
    return {
      year: null,
      months: [],
    };
  }

  return {
    year:
      value.year === null ||
      value.year === undefined
        ? null
        : toSafeNumber(value.year),

    months: Array.isArray(value.months)
      ? value.months.map((item) => ({
          month: toSafeString(
            item?.month,
            "",
          ),

          month_number: toSafeNumber(
            item?.month_number,
          ),

          profit: toSafeNumber(
            item?.profit,
          ),

          loss: toSafeNumber(
            item?.loss,
          ),

          net: toSafeNumber(item?.net),
        }))
      : [],
  };
}

function normalizeWinLoss(
  value: WinLossResponse | null | undefined,
): WinLossResponse {
  return {
    total_trades: toSafeNumber(
      value?.total_trades,
    ),

    winning_trades: toSafeNumber(
      value?.winning_trades,
    ),

    losing_trades: toSafeNumber(
      value?.losing_trades,
    ),

    break_even_trades: toSafeNumber(
      value?.break_even_trades,
    ),

    win_rate: toSafeNumber(
      value?.win_rate,
    ),

    loss_rate: toSafeNumber(
      value?.loss_rate,
    ),
  };
}

/* =========================
   Formatters
========================= */

function formatMoney(value: number) {
  const safeValue = toSafeNumber(value);

  return `$${Math.abs(
    safeValue,
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatSignedMoney(value: number) {
  const safeValue = toSafeNumber(value);

  if (safeValue === 0) {
    return "$0.00";
  }

  return `${
    safeValue >= 0 ? "+" : "-"
  }${formatMoney(safeValue)}`;
}

function formatDate(
  date: string | null | undefined,
) {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  ).format(d);
}

function formatChartDate(
  date: string | null | undefined,
) {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      month: "2-digit",
      day: "2-digit",
    },
  ).format(d);
}

/* =========================
   Empty Dashboard Data
========================= */

const EMPTY_SUMMARY: SummaryResponse = {
  total_reward: 0,
  total_profit: 0,
  total_loss: 0,
  total_trades: 0,
  winning_trades: 0,
  losing_trades: 0,
  win_rate: 0,
  profit_factor: 0,
  max_drawdown: 0,
  best_transaction: null,
  worst_transaction: null,
  transactions: [],
};

const EMPTY_WIN_LOSS: WinLossResponse = {
  total_trades: 0,
  winning_trades: 0,
  losing_trades: 0,
  break_even_trades: 0,
  win_rate: 0,
  loss_rate: 0,
};

const EMPTY_MONTHLY: MonthlyResponse = {
  year: null,
  months: [],
};

/* =========================
   Dashboard
========================= */

function DashboardPage() {
  const [summary, setSummary] =
    useState<SummaryResponse | null>(
      null,
    );

  const [equity, setEquity] =
    useState<EquityItem[]>([]);

  const [drawdown, setDrawdown] =
    useState<DrawdownItem[]>([]);

  const [monthly, setMonthly] =
    useState<MonthlyResponse | null>(
      null,
    );

  const [winLoss, setWinLoss] =
    useState<WinLossResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      /*
       * هر API به صورت جداگانه درخواست می‌شود.
       *
       * دلیل:
       * اگر کاربر Portfolio داشته باشد ولی هنوز
       * هیچ معامله‌ای نداشته باشد، ممکن است بعضی
       * endpointهای داشبورد از Backend خطا یا
       * response خالی برگردانند.
       *
       * در این حالت نباید کل Dashboard خراب شود.
       */

      const [
        summaryResult,
        equityResult,
        drawdownResult,
        monthlyResult,
        winLossResult,
      ] = await Promise.allSettled([
        apiFetch<SummaryResponse>(
          "/app/dashboard/summery/",
          {
            method: "GET",
          },
          {
            auth: true,
          },
        ),

        apiFetch<EquityResponse>(
          "/app/dashboard/equity/",
          {
            method: "GET",
          },
          {
            auth: true,
          },
        ),

        apiFetch<DrawdownItem[]>(
          "/app/dashboard/drawdown/",
          {
            method: "GET",
          },
          {
            auth: true,
          },
        ),

        apiFetch<MonthlyResponse>(
          "/app/dashboard/monthly-performance/",
          {
            method: "GET",
          },
          {
            auth: true,
          },
        ),

        apiFetch<WinLossResponse>(
          "/app/dashboard/win-loss-rate/",
          {
            method: "GET",
          },
          {
            auth: true,
          },
        ),
      ]);

      /* =========================
         Summary
      ========================= */

      if (
        summaryResult.status ===
        "fulfilled"
      ) {
        setSummary(
          normalizeSummary(
            summaryResult.value,
          ),
        );
      } else {
        console.warn(
          "Dashboard summary API error:",
          summaryResult.reason,
        );

        /*
         * حتی اگر Summary API برای
         * Portfolio بدون معامله خطا بدهد،
         * Dashboard را با داده صفر نمایش می‌دهیم.
         */
        setSummary(EMPTY_SUMMARY);
      }

      /* =========================
         Equity
      ========================= */

      if (
        equityResult.status ===
        "fulfilled"
      ) {
        setEquity(
          normalizeEquity(
            equityResult.value,
          ),
        );
      } else {
        console.warn(
          "Dashboard equity API error:",
          equityResult.reason,
        );

        setEquity([]);
      }

      /* =========================
         Drawdown
      ========================= */

      if (
        drawdownResult.status ===
        "fulfilled"
      ) {
        setDrawdown(
          normalizeDrawdown(
            drawdownResult.value,
          ),
        );
      } else {
        console.warn(
          "Dashboard drawdown API error:",
          drawdownResult.reason,
        );

        setDrawdown([]);
      }

      /* =========================
         Monthly
      ========================= */

      if (
        monthlyResult.status ===
        "fulfilled"
      ) {
        setMonthly(
          normalizeMonthly(
            monthlyResult.value,
          ),
        );
      } else {
        console.warn(
          "Dashboard monthly API error:",
          monthlyResult.reason,
        );

        setMonthly(
          EMPTY_MONTHLY,
        );
      }

      /* =========================
         Win / Loss
      ========================= */

      if (
        winLossResult.status ===
        "fulfilled"
      ) {
        setWinLoss(
          normalizeWinLoss(
            winLossResult.value,
          ),
        );
      } else {
        console.warn(
          "Dashboard win/loss API error:",
          winLossResult.reason,
        );

        setWinLoss(
          EMPTY_WIN_LOSS,
        );
      }
    } catch (err) {
      /*
       * این catch فقط برای خطاهای غیرمنتظره است.
       * خطاهای endpointهای Dashboard در بالا
       * به صورت جداگانه مدیریت شده‌اند.
       */

      console.error(
        "Dashboard unexpected error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "دریافت اطلاعات داشبورد ناموفق بود",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <AppShell
        title="داشبورد"
        subtitle="خلاصه عملکرد و آمار کلی حساب شما"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />

            در حال دریافت اطلاعات داشبورد...
          </div>
        </div>
      </AppShell>
    );
  }

  /* =========================
     Unexpected Error
  ========================= */

  if (error) {
    return (
      <AppShell
        title="داشبورد"
        subtitle="خلاصه عملکرد و آمار کلی حساب شما"
      >
        <div className="card-surface flex min-h-[300px] flex-col items-center justify-center gap-4 p-5">
          <p className="text-sm text-destructive">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            تلاش مجدد
          </button>
        </div>
      </AppShell>
    );
  }

  /*
   * در این مرحله همیشه Summary داریم؛
   * حتی اگر Backend برای Portfolio بدون
   * معامله اطلاعاتی برنگرداند.
   */
  const safeSummary =
    summary ?? EMPTY_SUMMARY;

  const safeWinLoss =
    winLoss ?? EMPTY_WIN_LOSS;

  const safeMonthly =
    monthly ?? EMPTY_MONTHLY;

  /* =========================
     Chart Data
  ========================= */

  const equityChartData =
    equity.map((item) => ({
      ...item,
      day: formatChartDate(
        item.date,
      ),
    }));

  const drawdownChartData =
    drawdown.map((item) => ({
      ...item,
      day: formatChartDate(
        item.date,
      ),
    }));

  const monthlyChartData =
    (safeMonthly.months ?? []).map(
      (item) => ({
        ...item,
        pnl: toSafeNumber(
          item.net,
        ),
      }),
    );

  const winningTrades =
    toSafeNumber(
      safeWinLoss.winning_trades,
    );

  const losingTrades =
    toSafeNumber(
      safeWinLoss.losing_trades,
    );

  const totalTrades =
    toSafeNumber(
      safeWinLoss.total_trades,
      toSafeNumber(
        safeSummary.total_trades,
      ),
    );

  const winRate =
    toSafeNumber(
      safeWinLoss.win_rate,
      toSafeNumber(
        safeSummary.win_rate,
      ),
    );

  const lossRate =
    toSafeNumber(
      safeWinLoss.loss_rate,
      Math.max(0, 100 - winRate),
    );

  const pieData = [
    {
      name: "برنده",
      value: winningTrades,
      color:
        "oklch(0.75 0.17 155)",
    },
    {
      name: "بازنده",
      value: losingTrades,
      color:
        "oklch(0.65 0.23 25)",
    },
  ];

  /* =========================
     Stats
  ========================= */

  const totalReward =
    toSafeNumber(
      safeSummary.total_reward,
    );

  const profitFactor =
    toSafeNumber(
      safeSummary.profit_factor,
    );

  const maxDrawdown =
    toSafeNumber(
      safeSummary.max_drawdown,
    );

  const stats = [
    {
      label: "سود کل",
      value:
        formatSignedMoney(
          totalReward,
        ),
      change: `سود خالص: ${formatSignedMoney(
        totalReward,
      )}`,
      positive:
        totalReward >= 0,
      icon: DollarSign,
    },

    {
      label: "نرخ برد",
      value: `${winRate.toLocaleString(
        "fa-IR",
        {
          maximumFractionDigits: 2,
        },
      )}٪`,
      change: `${winningTrades.toLocaleString(
        "fa-IR",
      )} معامله برنده`,
      positive: true,
      icon: Percent,
    },

    {
      label: "Profit Factor",
      value:
        profitFactor.toLocaleString(
          "fa-IR",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        ),
      change: `${toSafeNumber(
        safeSummary.total_trades,
      ).toLocaleString(
        "fa-IR",
      )} معامله`,
      positive:
        profitFactor >= 1,
      icon: TrendingUp,
    },

    {
      label: "Max Drawdown",
      value: `-${formatMoney(
        maxDrawdown,
      )}`,
      change: "حداکثر افت سرمایه",
      positive: false,
      icon: TrendingDown,
    },
  ];

  const transactions =
    Array.isArray(
      safeSummary.transactions,
    )
      ? safeSummary.transactions
      : [];

  const bestTransaction =
    safeSummary.best_transaction;

  const worstTransaction =
    safeSummary.worst_transaction;

  return (
    <AppShell
      title="داشبورد"
      subtitle="خلاصه عملکرد و آمار کلی حساب شما"
    >
      {/* =========================
          Empty Portfolio / Trades Info
      ========================= */}

      {toSafeNumber(
        safeSummary.total_trades,
      ) === 0 && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                هنوز معامله‌ای ثبت نشده است
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                پرتفلیوی شما فعال است. با ثبت اولین معامله، آمار و نمودارهای عملکرد در این صفحه نمایش داده می‌شوند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          KPI Cards
      ========================= */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card-surface p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {s.label}
              </span>

              <div
                className={`grid h-8 w-8 place-items-center rounded-lg ${
                  s.positive
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 text-2xl font-bold tabular">
              {s.value}
            </div>

            <div
              className={`mt-1 flex items-center gap-1 text-xs tabular ${
                s.positive
                  ? "gain"
                  : "loss"
              }`}
            >
              {s.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}

              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          Equity + Win/Loss
      ========================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                نمودار Equity
              </h3>

              <p className="text-xs text-muted-foreground">
                عملکرد حساب
              </p>
            </div>

            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary"
            >
              <Activity className="ml-1 h-3 w-3" />
              زنده
            </Badge>
          </div>

          <div className="mt-4 h-72">
            {equityChartData.length ===
            0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Activity className="h-8 w-8 opacity-40" />

                <span>
                  هنوز اطلاعات Equity موجود نیست
                </span>

                <span className="text-xs">
                  پس از ثبت معامله، نمودار عملکرد نمایش داده می‌شود.
                </span>
              </div>
            ) : (
              <ResponsiveContainer>
                <AreaChart
                  data={equityChartData}
                >
                  <defs>
                    <linearGradient
                      id="eq"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="oklch(0.75 0.17 155)"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="100%"
                        stopColor="oklch(0.75 0.17 155)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.02 255)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="oklch(0.68 0.02 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="oklch(0.68 0.02 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "oklch(0.185 0.022 255)",
                      border:
                        "1px solid oklch(0.28 0.02 255)",
                      borderRadius: 8,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="oklch(0.75 0.17 155)"
                    strokeWidth={2}
                    fill="url(#eq)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* =========================
            Win / Loss
        ========================= */}

        <div className="card-surface p-5">
          <h3 className="font-semibold">
            نرخ برد / باخت
          </h3>

          <p className="text-xs text-muted-foreground">
            {totalTrades.toLocaleString(
              "fa-IR",
            )}{" "}
            معامله
          </p>

          <div className="mt-4 h-56">
            {winningTrades === 0 &&
            losingTrades === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Percent className="h-8 w-8 opacity-40" />

                <span>
                  هنوز آماری برای نمایش وجود ندارد
                </span>
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {pieData.map(
                      (
                        entry,
                        index,
                      ) => (
                        <Cell
                          key={index}
                          fill={
                            entry.color
                          }
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background:
                        "oklch(0.185 0.022 255)",
                      border:
                        "1px solid oklch(0.28 0.02 255)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-primary/10 p-3">
              <div className="text-xs text-muted-foreground">
                برنده
              </div>

              <div className="text-lg font-bold gain tabular">
                {winRate.toLocaleString(
                  "fa-IR",
                  {
                    maximumFractionDigits: 2,
                  },
                )}
                ٪
              </div>

              <div className="text-xs text-muted-foreground">
                {winningTrades.toLocaleString(
                  "fa-IR",
                )}{" "}
                معامله
              </div>
            </div>

            <div className="rounded-lg bg-destructive/10 p-3">
              <div className="text-xs text-muted-foreground">
                بازنده
              </div>

              <div className="text-lg font-bold loss tabular">
                {lossRate.toLocaleString(
                  "fa-IR",
                  {
                    maximumFractionDigits: 2,
                  },
                )}
                ٪
              </div>

              <div className="text-xs text-muted-foreground">
                {losingTrades.toLocaleString(
                  "fa-IR",
                )}{" "}
                معامله
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Monthly + Drawdown
      ========================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Monthly */}

        <div className="card-surface p-5">
          <h3 className="font-semibold">
            عملکرد ماهانه
          </h3>

          <p className="text-xs text-muted-foreground">
            سود / زیان به دلار
            {safeMonthly.year
              ? ` — سال ${safeMonthly.year}`
              : ""}
          </p>

          <div className="mt-4 h-64">
            {monthlyChartData.length ===
            0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <BarChart3 className="h-8 w-8 opacity-40" />

                <span>
                  اطلاعات عملکرد ماهانه موجود نیست
                </span>
              </div>
            ) : (
              <ResponsiveContainer>
                <BarChart
                  data={monthlyChartData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.02 255)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    stroke="oklch(0.68 0.02 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="oklch(0.68 0.02 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "oklch(0.185 0.022 255)",
                      border:
                        "1px solid oklch(0.28 0.02 255)",
                      borderRadius: 8,
                    }}
                  />

                  <Bar
                    dataKey="pnl"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  >
                    {monthlyChartData.map(
                      (
                        entry,
                        index,
                      ) => (
                        <Cell
                          key={index}
                          fill={
                            entry.pnl >=
                            0
                              ? "oklch(0.75 0.17 155)"
                              : "oklch(0.65 0.23 25)"
                          }
                        />
                      ),
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Drawdown */}

        <div className="card-surface p-5">
          <h3 className="font-semibold">
            نمودار Drawdown
          </h3>

          <p className="text-xs text-muted-foreground">
            میزان افت سرمایه
          </p>

          <div className="mt-4 h-64">
            {drawdownChartData.length ===
            0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <TrendingDown className="h-8 w-8 opacity-40" />

                <span>
                  هنوز اطلاعات Drawdown موجود نیست
                </span>
              </div>
            ) : (
              <ResponsiveContainer>
                <LineChart
                  data={drawdownChartData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.02 255)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="oklch(0.68 0.02 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="oklch(0.68 0.02 255)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "oklch(0.185 0.022 255)",
                      border:
                        "1px solid oklch(0.28 0.02 255)",
                      borderRadius: 8,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="dd"
                    stroke="oklch(0.65 0.23 25)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          Recent Trades
      ========================= */}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              آخرین معاملات
            </h3>

            <Badge variant="outline">
              {toSafeNumber(
                safeSummary.total_trades,
              ).toLocaleString(
                "fa-IR",
              )}{" "}
              معامله
            </Badge>
          </div>

          <div className="mt-4 overflow-x-auto">
            {transactions.length ===
            0 ? (
              <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Activity className="h-8 w-8 opacity-40" />

                <span>
                  هنوز معامله‌ای ثبت نشده است
                </span>

                <span className="text-xs">
                  پس از ثبت معامله، آخرین معاملات در این قسمت نمایش داده می‌شوند.
                </span>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-2 text-right font-medium">
                      نماد
                    </th>

                    <th className="py-2 text-right font-medium">
                      نوع
                    </th>

                    <th className="py-2 text-right font-medium">
                      حجم
                    </th>

                    <th className="py-2 text-right font-medium">
                      R:R
                    </th>

                    <th className="py-2 text-right font-medium">
                      سود/زیان
                    </th>

                    <th className="py-2 text-right font-medium">
                      تاریخ
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions
                    .slice(0, 6)
                    .map(
                      (
                        trade,
                        index,
                      ) => {
                        const isBuy =
                          trade.transaction_type ===
                          "buy";

                        const reward =
                          toSafeNumber(
                            trade.total_reward,
                          );

                        return (
                          <tr
                            key={`${toSafeString(
                              trade.symbol,
                              "trade",
                            )}-${toSafeString(
                              trade.created_at,
                              String(index),
                            )}-${index}`}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="py-3 font-medium">
                              {toSafeString(
                                trade.symbol,
                              )}
                            </td>

                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={
                                  isBuy
                                    ? "border-primary/40 bg-primary/10 text-primary"
                                    : "border-destructive/40 bg-destructive/10 text-destructive"
                                }
                              >
                                {isBuy
                                  ? "خرید"
                                  : "فروش"}
                              </Badge>
                            </td>

                            <td className="py-3 tabular">
                              {toSafeString(
                                trade.volume,
                                "0",
                              )}
                            </td>

                            <td className="py-3 tabular">
                              {toSafeString(
                                trade.r_r,
                                "—",
                              )}
                            </td>

                            <td
                              className={`py-3 tabular font-medium ${
                                reward >=
                                0
                                  ? "gain"
                                  : "loss"
                              }`}
                            >
                              {formatSignedMoney(
                                reward,
                              )}
                            </td>

                            <td className="py-3 text-xs text-muted-foreground tabular">
                              {formatDate(
                                trade.created_at,
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* =========================
            Best / Worst
        ========================= */}

        <div className="space-y-4">
          {/* Best */}

          <div className="card-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />

              بهترین معامله
            </div>

            {bestTransaction ? (
              <>
                <div className="mt-3 text-lg font-bold">
                  {toSafeString(
                    bestTransaction.symbol,
                  )}
                </div>

                <div className="gain text-2xl font-bold tabular">
                  {formatSignedMoney(
                    toSafeNumber(
                      bestTransaction.total_reward,
                    ),
                  )}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  R:R{" "}
                  {toSafeString(
                    bestTransaction.r_r,
                  )}{" "}
                  •{" "}
                  {formatDate(
                    bestTransaction.created_at,
                  )}
                </div>
              </>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground">
                هنوز معامله‌ای برای نمایش وجود ندارد.
              </div>
            )}
          </div>

          {/* Worst */}

          <div className="card-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-destructive" />

              بدترین معامله
            </div>

            {worstTransaction ? (
              <>
                <div className="mt-3 text-lg font-bold">
                  {toSafeString(
                    worstTransaction.symbol,
                  )}
                </div>

                <div className="loss text-2xl font-bold tabular">
                  {formatSignedMoney(
                    toSafeNumber(
                      worstTransaction.total_reward,
                    ),
                  )}
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  R:R{" "}
                  {toSafeString(
                    worstTransaction.r_r,
                  )}{" "}
                  •{" "}
                  {formatDate(
                    worstTransaction.created_at,
                  )}
                </div>
              </>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground">
                هنوز معامله‌ای برای نمایش وجود ندارد.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          Totals
      ========================= */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {/* Total Profit */}

        <div className="card-surface p-5">
          <div className="text-sm text-muted-foreground">
            مجموع سود معاملات
          </div>

          <div className="mt-2 text-2xl font-bold gain tabular">
            +
            {formatMoney(
              toSafeNumber(
                safeSummary.total_profit,
              ),
            )}
          </div>
        </div>

        {/* Total Loss */}

        <div className="card-surface p-5">
          <div className="text-sm text-muted-foreground">
            مجموع زیان معاملات
          </div>

          <div className="mt-2 text-2xl font-bold loss tabular">
            -
            {formatMoney(
              toSafeNumber(
                safeSummary.total_loss,
              ),
            )}
          </div>
        </div>

        {/* Total Trades */}

        <div className="card-surface p-5">
          <div className="text-sm text-muted-foreground">
            تعداد کل معاملات
          </div>

          <div className="mt-2 text-2xl font-bold tabular">
            {toSafeNumber(
              safeSummary.total_trades,
            ).toLocaleString(
              "fa-IR",
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}