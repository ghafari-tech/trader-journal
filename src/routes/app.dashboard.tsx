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
  volume: string;
  r_r: string;
  total_reward: number;
  created_at: string;
};

type BestWorstTransaction = {
  symbol: string;
  total_reward: number;
  r_r: string;
  created_at: string;
};

type SummaryResponse = {
  total_reward: number;
  total_profit: number;
  total_loss: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  profit_factor: number;
  max_drawdown: number;
  best_transaction: BestWorstTransaction;
  worst_transaction: BestWorstTransaction;
  transactions: SummaryTransaction[];
};

/* =========================
   Equity API
========================= */

type EquityItem = {
  date: string;
  equity: number;
};

type EquityResponse = {
  start_date: string;
  end_date: string;
  data: EquityItem[];
};

/* =========================
   Drawdown
========================= */

type DrawdownItem = {
  date: string;
  dd: number;
};

/* =========================
   Monthly
========================= */

type MonthlyItem = {
  month: string;
  month_number: number;
  profit: number;
  loss: number;
  net: number;
};

type MonthlyResponse = {
  year: number;
  months: MonthlyItem[];
};

/* =========================
   Win / Loss
========================= */

type WinLossResponse = {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  break_even_trades: number;
  win_rate: number;
  loss_rate: number;
};

/* =========================
   Helpers
========================= */

function formatMoney(value: number) {
  return `$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatSignedMoney(value: number) {
  return `${value >= 0 ? "+" : "-"}${formatMoney(value)}`;
}

function formatDate(date: string) {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function formatChartDate(date: string) {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/* =========================
   Dashboard
========================= */

function DashboardPage() {
  const [summary, setSummary] =
    useState<SummaryResponse | null>(null);

  const [equity, setEquity] =
    useState<EquityItem[]>([]);

  const [drawdown, setDrawdown] =
    useState<DrawdownItem[]>([]);

  const [monthly, setMonthly] =
    useState<MonthlyResponse | null>(null);

  const [winLoss, setWinLoss] =
    useState<WinLossResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        summaryResponse,
        equityResponse,
        drawdownResponse,
        monthlyResponse,
        winLossResponse,
      ] = await Promise.all([
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

      setSummary(summaryResponse);

      // API واقعی Equity دارای data است
      setEquity(equityResponse.data);

      setDrawdown(drawdownResponse);
      setMonthly(monthlyResponse);
      setWinLoss(winLossResponse);
    } catch (err) {
      console.error(
        "Dashboard API error:",
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
     Error
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

  if (!summary) {
    return null;
  }

  /* =========================
     Chart Data
  ========================= */

  const equityChartData = equity.map(
    (item) => ({
      ...item,
      day: formatChartDate(item.date),
    }),
  );

  const drawdownChartData =
    drawdown.map((item) => ({
      ...item,
      day: formatChartDate(item.date),
    }));

  const monthlyChartData =
    monthly?.months.map((item) => ({
      ...item,
      pnl: item.net,
    })) ?? [];

  const pieData = [
    {
      name: "برنده",
      value:
        winLoss?.winning_trades ??
        summary.winning_trades,
      color:
        "oklch(0.75 0.17 155)",
    },
    {
      name: "بازنده",
      value:
        winLoss?.losing_trades ??
        summary.losing_trades,
      color:
        "oklch(0.65 0.23 25)",
    },
  ];

  /* =========================
     Stats
  ========================= */

  const stats = [
    {
      label: "سود کل",
      value: formatSignedMoney(
        summary.total_reward,
      ),
      change: `سود خالص: ${formatSignedMoney(
        summary.total_reward,
      )}`,
      positive:
        summary.total_reward >= 0,
      icon: DollarSign,
    },

    {
      label: "نرخ برد",
      value: `${summary.win_rate.toLocaleString(
        "fa-IR",
        {
          maximumFractionDigits: 2,
        },
      )}٪`,
      change: `${summary.winning_trades.toLocaleString(
        "fa-IR",
      )} معامله برنده`,
      positive: true,
      icon: Percent,
    },

    {
      label: "Profit Factor",
      value:
        summary.profit_factor.toLocaleString(
          "fa-IR",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        ),
      change: `${summary.total_trades.toLocaleString(
        "fa-IR",
      )} معامله`,
      positive:
        summary.profit_factor >= 1,
      icon: TrendingUp,
    },

    {
      label: "Max Drawdown",
      value: `-${formatMoney(
        summary.max_drawdown,
      )}`,
      change: "حداکثر افت سرمایه",
      positive: false,
      icon: TrendingDown,
    },
  ];

  return (
    <AppShell
      title="داشبورد"
      subtitle="خلاصه عملکرد و آمار کلی حساب شما"
    >
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
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                اطلاعات Equity موجود نیست
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

                  {/* فقط Equity چون API واقعی balance ندارد */}
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
            {(
              winLoss?.total_trades ??
              summary.total_trades
            ).toLocaleString("fa-IR")}{" "}
            معامله
          </p>

          <div className="mt-4 h-56">
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
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
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
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-primary/10 p-3">
              <div className="text-xs text-muted-foreground">
                برنده
              </div>

              <div className="text-lg font-bold gain tabular">
                {(
                  winLoss?.win_rate ??
                  summary.win_rate
                ).toLocaleString("fa-IR", {
                  maximumFractionDigits: 2,
                })}
                ٪
              </div>

              <div className="text-xs text-muted-foreground">
                {(
                  winLoss?.winning_trades ??
                  summary.winning_trades
                ).toLocaleString("fa-IR")}{" "}
                معامله
              </div>
            </div>

            <div className="rounded-lg bg-destructive/10 p-3">
              <div className="text-xs text-muted-foreground">
                بازنده
              </div>

              <div className="text-lg font-bold loss tabular">
                {(
                  winLoss?.loss_rate ??
                  100 - summary.win_rate
                ).toLocaleString("fa-IR", {
                  maximumFractionDigits: 2,
                })}
                ٪
              </div>

              <div className="text-xs text-muted-foreground">
                {(
                  winLoss?.losing_trades ??
                  summary.losing_trades
                ).toLocaleString("fa-IR")}{" "}
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
            سود / زیان به دلار — سال{" "}
            {monthly?.year ?? 1405}
          </p>

          <div className="mt-4 h-64">
            {monthlyChartData.length ===
            0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                اطلاعات عملکرد ماهانه موجود نیست
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
                    radius={[6, 6, 0, 0]}
                  >
                    {monthlyChartData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.pnl >= 0
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
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                اطلاعات Drawdown موجود نیست
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
              {summary.total_trades.toLocaleString(
                "fa-IR",
              )}{" "}
              معامله
            </Badge>
          </div>

          <div className="mt-4 overflow-x-auto">
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
                {summary.transactions
                  .slice(0, 6)
                  .map(
                    (trade, index) => {
                      const isBuy =
                        trade.transaction_type ===
                        "buy";

                      return (
                        <tr
                          key={`${trade.symbol}-${trade.created_at}-${index}`}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="py-3 font-medium">
                            {trade.symbol}
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
                            {trade.volume}
                          </td>

                          <td className="py-3 tabular">
                            {trade.r_r}
                          </td>

                          <td
                            className={`py-3 tabular font-medium ${
                              trade.total_reward >=
                              0
                                ? "gain"
                                : "loss"
                            }`}
                          >
                            {formatSignedMoney(
                              trade.total_reward,
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

            <div className="mt-3 text-lg font-bold">
              {
                summary.best_transaction
                  .symbol
              }
            </div>

            <div className="gain text-2xl font-bold tabular">
              {formatSignedMoney(
                summary.best_transaction
                  .total_reward,
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              R:R{" "}
              {
                summary.best_transaction
                  .r_r
              }{" "}
              •{" "}
              {formatDate(
                summary.best_transaction
                  .created_at,
              )}
            </div>
          </div>

          {/* Worst */}

          <div className="card-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-destructive" />

              بدترین معامله
            </div>

            <div className="mt-3 text-lg font-bold">
              {
                summary.worst_transaction
                  .symbol
              }
            </div>

            <div className="loss text-2xl font-bold tabular">
              {formatSignedMoney(
                summary.worst_transaction
                  .total_reward,
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              R:R{" "}
              {
                summary.worst_transaction
                  .r_r
              }{" "}
              •{" "}
              {formatDate(
                summary.worst_transaction
                  .created_at,
              )}
            </div>
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
            +{formatMoney(
              summary.total_profit,
            )}
          </div>
        </div>

        {/* Total Loss */}

        <div className="card-surface p-5">
          <div className="text-sm text-muted-foreground">
            مجموع زیان معاملات
          </div>

          <div className="mt-2 text-2xl font-bold loss tabular">
            -{formatMoney(
              summary.total_loss,
            )}
          </div>
        </div>

        {/* Total Trades */}

        <div className="card-surface p-5">
          <div className="text-sm text-muted-foreground">
            تعداد کل معاملات
          </div>

          <div className="mt-2 text-2xl font-bold tabular">
            {summary.total_trades.toLocaleString(
              "fa-IR",
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}