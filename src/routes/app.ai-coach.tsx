import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Brain,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Cpu,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aiInsights } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ai-coach")({
  head: () => ({ meta: [{ title: "مربی هوشمند" }] }),
  component: AiCoach,
});

function AiCoach() {
  const [model, setModel] = useState(aiInsights.models[0].id);
  const activeModel = aiInsights.models.find((m) => m.id === model)!;

  return (
    <AppShell
      title="مربی هوشمند AI"
      subtitle="تحلیل عمیق سبک معامله‌گری و پیشنهادهای شخصی برای رشد"
      actions={
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => toast.success(`تحلیل جدید با ${activeModel.name} در حال ساخت است...`)}
        >
          <RefreshCw className="ml-1 h-4 w-4" />تحلیل جدید
        </Button>
      }
    >
      {/* Model selector */}
      <div className="card-surface p-5">
        <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">مدل مربی هوشمند</div>
              <div className="text-xs text-muted-foreground">{activeModel.desc}</div>
            </div>
          </div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-secondary/60 md:max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiInsights.models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex flex-col text-right">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-[11px] text-muted-foreground">{m.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Brain className="ml-1 h-3 w-3" /> فعال
          </Badge>
        </div>
      </div>

      {/* Hero AI card */}
      <div className="card-surface hero-bg mt-6 overflow-hidden p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">گزارش هفتگی مربی</h2>
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                <Brain className="ml-1 h-3 w-3" />هوش مصنوعی
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              علی عزیز — هفته خوبی داشتی. پایبندی به حد ضرر تو <span className="font-semibold gain">۹۲٪</span> بوده که عالی است. اما در دو مورد بعد از ضرر متوالی، رفتار <span className="font-semibold loss">Revenge Trading</span> از تو دیدم. پیشنهاد می‌کنم بعد از هر ضرر، ۳۰ دقیقه از پلتفرم فاصله بگیری. اگر این عادت را ادامه دهی، Profit Factor تو تا ماه بعد می‌تواند به ۲.۸ برسد.
            </p>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {aiInsights.scores.map((s) => (
          <div key={s.label} className="card-surface p-5">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular">{s.value}</span>
              <span className="text-sm text-muted-foreground">/ ۱۰۰</span>
            </div>
            <Progress value={s.value} className="mt-3 h-1.5" />
          </div>
        ))}
      </div>

      {/* Strengths / Weaknesses */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">نقاط قوت</h3>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">راهکار پایداری</Badge>
          </div>
          <ul className="mt-4 space-y-4 text-sm">
            {aiInsights.strengths.map((s) => (
              <li key={s.title} className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="font-medium">{s.title}</span>
                </div>
                <div className="mt-2 flex items-start gap-2 rounded-md bg-background/40 p-2.5 text-xs text-foreground/90">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span><span className="font-semibold text-primary">پایدار نگه‌داری:</span> {s.keepDoing}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold">نقاط ضعف</h3>
            <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">راهکار پیشنهادی</Badge>
          </div>
          <ul className="mt-4 space-y-4 text-sm">
            {aiInsights.weaknesses.map((w) => (
              <li key={w.title} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <div className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  <span className="font-medium">{w.title}</span>
                </div>
                <div className="mt-2 flex items-start gap-2 rounded-md bg-background/40 p-2.5 text-xs text-foreground/90">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span><span className="font-semibold text-accent">راهکار:</span> {w.solution}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reports (Weekly + Daily) */}
      <div className="mt-6 card-surface p-5">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">گزارش عملکرد</h3>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="ml-1 h-3 w-3" />تولید‌شده با AI
          </Badge>
        </div>
        <Tabs defaultValue="weekly" className="mt-4">
          <TabsList className="bg-secondary/60">
            <TabsTrigger value="weekly"><CalendarRange className="ml-1 h-3.5 w-3.5" />هفتگی</TabsTrigger>
            <TabsTrigger value="daily"><CalendarDays className="ml-1 h-3.5 w-3.5" />روزانه</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4 space-y-4">
            <div className="text-xs text-muted-foreground">بازه: <span className="tabular">{aiInsights.weeklyReport.range}</span></div>
            <p className="text-sm leading-relaxed text-foreground/90">{aiInsights.weeklyReport.summary}</p>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {aiInsights.weeklyReport.stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-secondary/40 p-3">
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-sm font-bold tabular">{s.value}</div>
                </div>
              ))}
            </div>
            <ul className="space-y-2 text-sm">
              {aiInsights.weeklyReport.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-foreground/90">{h}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="daily" className="mt-4 space-y-4">
            <div className="text-xs text-muted-foreground">تاریخ: <span className="tabular">{aiInsights.dailyReport.date}</span></div>
            <p className="text-sm leading-relaxed text-foreground/90">{aiInsights.dailyReport.summary}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {aiInsights.dailyReport.stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-secondary/40 p-3">
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-sm font-bold tabular">{s.value}</div>
                </div>
              ))}
            </div>
            <ul className="space-y-2 text-sm">
              {aiInsights.dailyReport.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-foreground/90">{h}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      {/* Suggestions + Behaviors */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <h3 className="font-semibold">الگوهای رفتاری شناسایی‌شده</h3>
          <p className="text-xs text-muted-foreground">تعداد دفعات در ۳۰ روز اخیر</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={aiInsights.behaviors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 255)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip contentStyle={{ background: "oklch(0.185 0.022 255)", border: "1px solid oklch(0.28 0.02 255)", borderRadius: 8 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {aiInsights.behaviors.map((_, i) => (
                    <Cell key={i} fill={i % 2 ? "oklch(0.65 0.23 25)" : "oklch(0.8 0.14 82)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">تمرین‌های پیشنهادی</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "۳ روز فقط ست‌آپ‌های A+ ترید کن.",
              "قبل از هر معامله، دلیل ورود را بنویس.",
              "شب‌ها ژورنال روزت را مرور کن.",
              "حداکثر ۲ معامله در روز.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 p-3">
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary tabular">
                  {i + 1}
                </div>
                <span className="text-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
