import { createFileRoute } from "@tanstack/react-router";
import { Area,AreaChart, Bar,BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart as ReLine,
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
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import {
  drawdownData,
  equityCurve,
  monthlyPerformance,
  trades,
  winLossData,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "داشبورد — TraderJournal" }] }),
  component: DashboardPage,
});

const stats = [
  { label: "سود کل", value: "$۱,۴۸۰", change: "+۲۴.۸٪", positive: true, icon: DollarSign },
  { label: "نرخ برد", value: "50٪", change: "+۴.۲٪", positive: true, icon: Percent },
  { label: "Profit Factor", value: "۲.۱۴", change: "+۰.۳", positive: true, icon: TrendingUp },
  { label: "Max Drawdown", value: "-۸.۲٪", change: "-۱.۱٪", positive: false, icon: TrendingDown },
];

function DashboardPage() {
  return (
    <AppShell title="داشبورد" subtitle="خلاصه عملکرد و آمار کلی حساب شما">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${s.positive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tabular">{s.value}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs tabular ${s.positive ? "gain" : "loss"}`}>
              {s.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {s.change} نسبت به ماه قبل
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */} 
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">نمودار Equity</h3>
              <p className="text-xs text-muted-foreground">۳۰ روز اخیر</p>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <Activity className="ml-1 h-3 w-3" />
              زنده
            </Badge>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.17 155)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.75 0.17 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 255)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.185 0.022 255)", border: "1px solid oklch(0.28 0.02 255)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="equity" stroke="oklch(0.75 0.17 155)" strokeWidth={2} fill="url(#eq)" />
                <Area type="monotone" dataKey="balance" stroke="oklch(0.68 0.16 245)" strokeWidth={1.5} fillOpacity={0} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <h3 className="font-semibold">نرخ برد / باخت</h3>
          <p className="text-xs text-muted-foreground">۱۲۰ معامله</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={winLossData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {winLossData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.185 0.022 255)", border: "1px solid oklch(0.28 0.02 255)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-primary/10 p-3">
              <div className="text-xs text-muted-foreground">برنده</div>
              <div className="text-lg font-bold gain tabular">۶۸٪</div>
            </div>
            <div className="rounded-lg bg-destructive/10 p-3">
              <div className="text-xs text-muted-foreground">بازنده</div>
              <div className="text-lg font-bold loss tabular">۳۲٪</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h3 className="font-semibold">عملکرد ماهانه</h3>
          <p className="text-xs text-muted-foreground">سود/زیان به دلار</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 255)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.185 0.022 255)", border: "1px solid oklch(0.28 0.02 255)", borderRadius: 8 }} />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {monthlyPerformance.map((e, i) => (
                    <Cell key={i} fill={e.pnl >= 0 ? "oklch(0.75 0.17 155)" : "oklch(0.65 0.23 25)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <h3 className="font-semibold">نمودار Drawdown</h3>
          <p className="text-xs text-muted-foreground">درصد افت سرمایه</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <ReLine data={drawdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 255)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.185 0.022 255)", border: "1px solid oklch(0.28 0.02 255)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="dd" stroke="oklch(0.65 0.23 25)" strokeWidth={2} dot={false} />
              </ReLine>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent trades + best/worst */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">آخرین معاملات</h3>
            <Badge variant="outline">{trades.length} معامله</Badge>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 text-right font-medium">نماد</th>
                  <th className="py-2 text-right font-medium">نوع</th>
                  <th className="py-2 text-right font-medium">حجم</th>
                  <th className="py-2 text-right font-medium">R:R</th>
                  <th className="py-2 text-right font-medium">سود/زیان</th>
                  <th className="py-2 text-right font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 6).map((t) => (
                  <tr key={t.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{t.symbol}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={t.side === "buy" ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}>
                        {t.side === "buy" ? "خرید" : "فروش"}
                      </Badge>
                    </td>
                    <td className="py-3 tabular">{t.volume}</td>
                    <td className="py-3 tabular">{t.rr}</td>
                    <td className={`py-3 tabular font-medium ${t.pnl >= 0 ? "gain" : "loss"}`}>
                      {t.pnl >= 0 ? "+" : ""}${t.pnl}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground tabular">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />
              بهترین معامله
            </div>
            <div className="mt-3 text-lg font-bold">XAUUSD</div>
            <div className="gain text-2xl font-bold tabular">+$۷۱۵</div>
            <div className="mt-2 text-xs text-muted-foreground">R:R ۱.۸ • ۱۴۰۳/۰۸/۱۱</div>
          </div>
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-destructive" />
              بدترین معامله
            </div>
            <div className="mt-3 text-lg font-bold">XAUUSD</div>
            <div className="loss text-2xl font-bold tabular">-$۱,۱۲۷</div>
            <div className="mt-2 text-xs text-muted-foreground">R:R -۱.۶ • ۱۴۰۳/۰۸/۰۵</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
