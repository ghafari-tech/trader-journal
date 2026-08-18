import { createFileRoute } from "@tanstack/react-router";
import { Users, CreditCard, Cpu, Activity, Plus, MoreVertical, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users, payments } from "@/lib/mock-data";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "پنل مدیریت" }] }),
  component: AdminPage,
});

const kpis = [
  { label: "کل کاربران", value: "۱,۲۴۸", change: "+۱۲٪", icon: Users },
  { label: "اشتراک‌های فعال", value: "۴۸۲", change: "+۸٪", icon: CreditCard },
  { label: "درآمد ماهانه", value: "۸۹۰M", change: "+۲۲٪", icon: TrendingUp },
  { label: "API Calls", value: "۱۲۴K", change: "+۳۴٪", icon: Cpu },
];

function AdminPage() {
  return (
    <AppShell title="پنل مدیریت" subtitle="مدیریت کاربران، اشتراک‌ها، APIها و تنظیمات سیستم">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.label}</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tabular">{k.value}</div>
            <div className="mt-1 text-xs gain tabular">{k.change} این ماه</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Tabs defaultValue="users" dir="rtl">
          <TabsList>
            <TabsTrigger value="users">کاربران</TabsTrigger>
            <TabsTrigger value="payments">پرداخت‌ها</TabsTrigger>
            <TabsTrigger value="plans">پلن‌ها</TabsTrigger>
            <TabsTrigger value="apis">API هوش مصنوعی</TabsTrigger>
            <TabsTrigger value="logs">لاگ‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <div className="card-surface p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-3 text-right">کاربر</th>
                    <th className="py-3 text-right">ایمیل</th>
                    <th className="py-3 text-right">پلن</th>
                    <th className="py-3 text-right">وضعیت</th>
                    <th className="py-3 text-right">تاریخ عضویت</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                      <td className="py-3 font-medium">{u.name}</td>
                      <td className="py-3 text-muted-foreground">{u.email}</td>
                      <td className="py-3"><Badge variant="outline" className={u.plan === "Pro Max" ? "border-primary/40 bg-primary/10 text-primary" : ""}>{u.plan}</Badge></td>
                      <td className="py-3"><Badge variant="outline" className={u.status === "فعال" ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}>{u.status}</Badge></td>
                      <td className="py-3 text-xs text-muted-foreground tabular">{u.joined}</td>
                      <td className="py-3"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <div className="card-surface p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-3 text-right">شناسه</th>
                    <th className="py-3 text-right">کاربر</th>
                    <th className="py-3 text-right">پلن</th>
                    <th className="py-3 text-right">مبلغ</th>
                    <th className="py-3 text-right">تاریخ</th>
                    <th className="py-3 text-right">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 text-xs tabular text-muted-foreground">{p.id}</td>
                      <td className="py-3">{p.user}</td>
                      <td className="py-3">{p.plan}</td>
                      <td className="py-3 tabular">{p.amount}</td>
                      <td className="py-3 text-xs text-muted-foreground tabular">{p.date}</td>
                      <td className="py-3"><Badge variant="outline" className={p.status === "موفق" ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}>{p.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { n: "رایگان", p: "۰ تومان", u: 764 },
                { n: "Pro", p: "۱,۰۰۰,۰۰۰ تومان", u: 302 },
                { n: "Pro Max", p: "۲,۰۰۰,۰۰۰ تومان", u: 180 },
              ].map((p) => (
                <div key={p.n} className="card-surface p-5">
                  <div className="font-semibold">{p.n}</div>
                  <div className="mt-2 text-2xl font-bold tabular">{p.p}</div>
                  <div className="mt-4 text-sm text-muted-foreground">{p.u} کاربر فعال</div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">ویرایش پلن</Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="apis" className="mt-4">
            <div className="card-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">APIهای فعال</h3>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="ml-1 h-4 w-4" />افزودن API</Button>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { n: "OpenAI GPT-5", key: "sk-...xY42", usage: 68, def: true },
                  { n: "Google Gemini Pro", key: "AIza...9k", usage: 42, def: false },
                ].map((a) => (
                  <div key={a.n} className="flex items-center gap-4 rounded-lg border border-border bg-secondary/40 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{a.n}</span>
                        {a.def && <Badge className="bg-primary text-primary-foreground">پیش‌فرض</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground tabular">کلید: {a.key}</div>
                    </div>
                    <div className="text-sm tabular">{a.usage.toLocaleString()}K درخواست</div>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <div className="card-surface p-5">
              <div className="space-y-2 font-mono text-xs">
                {[
                  { t: "12:04:32", l: "INFO", m: "New user registered: maryam@example.com" },
                  { t: "12:03:11", l: "INFO", m: "AI analysis completed for user U1" },
                  { t: "11:58:07", l: "WARN", m: "Rate limit approaching for API openai_prod" },
                  { t: "11:45:22", l: "INFO", m: "Payment successful: PY1 — ۲,۰۰۰,۰۰۰ تومان" },
                  { t: "11:32:00", l: "ERROR", m: "MetaTrader sync failed for portfolio P4" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 rounded border border-border bg-background/50 p-2.5">
                    <span className="text-muted-foreground tabular">{log.t}</span>
                    <Badge variant="outline" className={
                      log.l === "ERROR" ? "border-destructive/40 bg-destructive/10 text-destructive" :
                      log.l === "WARN" ? "border-accent/40 bg-accent/10 text-accent" :
                      "border-primary/40 bg-primary/10 text-primary"
                    }>{log.l}</Badge>
                    <span className="flex-1 truncate">{log.m}</span>
                    <Activity className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
