import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import {
  getAiCoachAnalysis,
  getAiCoachModels,
  regenerateAiCoachAnalysis,
  type AiCoachAnalysis,
  type AiCoachModel,
} from "@/api/ai-coach";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUserFullName } from "@/lib/current-user";

export const Route = createFileRoute("/app/ai-coach")({
  head: () => ({ meta: [{ title: "مربی هوشمند" }] }),
  component: AiCoach,
});

function AiCoach() {
  const navigate = useNavigate();
  const [models, setModels] = useState<AiCoachModel[]>([]);
  const [modelId, setModelId] = useState<string>("");
  const [analysis, setAnalysis] = useState<AiCoachAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  const activeModel = useMemo(
    () => models.find((item) => String(item.id) === modelId) ?? models[0],
    [models, modelId],
  );

  async function handleAuthError(err: unknown) {
    if (err instanceof ApiError && err.status === 401) {
      toast.error("نشست شما منقضی شده است. دوباره وارد شوید");
      await navigate({ to: "/login" });
      return true;
    }
    return false;
  }

  async function loadPage() {
    try {
      setLoading(true);
      setError("");

      const [modelsResult, analysisResult] = await Promise.allSettled([
        getAiCoachModels(),
        getAiCoachAnalysis(),
      ]);

      // چک کردن احراز هویت برای خطاهای رخ‌داده
      if (modelsResult.status === "rejected" && (await handleAuthError(modelsResult.reason))) return;
      if (analysisResult.status === "rejected" && (await handleAuthError(analysisResult.reason))) return;

      // اگر هر دو ریکوئست شکست خوردند، صفحه خطا نمایش داده شود
      if (modelsResult.status === "rejected" && analysisResult.status === "rejected") {
        const err = modelsResult.reason;
        throw new Error(err instanceof Error ? err.message : "دریافت اطلاعات مربی هوشمند ناموفق بود");
      }

      const modelList = modelsResult.status === "fulfilled" ? modelsResult.value : [];
      const currentAnalysis = analysisResult.status === "fulfilled" ? analysisResult.value : null;

      setModels(modelList);
      setAnalysis(currentAnalysis);

      // تعیین مدل فعال
      const preferredId =
        currentAnalysis?.modelId &&
        modelList.some((item) => String(item.id) === String(currentAnalysis.modelId))
          ? currentAnalysis.modelId
          : modelList[0]?.id;

      if (preferredId != null) {
        setModelId(String(preferredId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "دریافت تحلیل مربی هوشمند ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPage();
  }, []);

  async function handleRegenerate() {
    if (!modelId) {
      toast.error("ابتدا یک مدل مربی انتخاب کنید");
      return;
    }

    const selectedId = Number(modelId);
    // اگر IDها عددی هستند بررسی کنید؛ در غیر این صورت می‌توانید تبدیل به Number را حذف کنید
    const parsedId = Number.isNaN(selectedId) ? modelId : selectedId;

    try {
      setRegenerating(true);
      const next = await regenerateAiCoachAnalysis(parsedId as number);
      setAnalysis(next);

      if (next?.modelId) {
        setModelId(String(next.modelId));
      }

      toast.success(
        activeModel
          ? `تحلیل جدید با ${activeModel.name} آماده شد`
          : "تحلیل جدید آماده شد",
      );
    } catch (err) {
      if (await handleAuthError(err)) return;
      toast.error(err instanceof Error ? err.message : "ساخت تحلیل جدید ناموفق بود");
    } finally {
      setRegenerating(false);
    }
  }

  const userName = getCurrentUserFullName();
  const heroText = useMemo(() => {
    if (!analysis?.summary) return "";
    return analysis.summary.startsWith(userName)
      ? analysis.summary
      : `${userName} عزیز — ${analysis.summary}`;
  }, [analysis?.summary, userName]);

  if (loading) {
    return (
      <AppShell
        title="مربی هوشمند AI"
        subtitle="تحلیل عمیق سبک معامله‌گری و پیشنهادهای شخصی برای رشد"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال دریافت تحلیل مربی هوشمند...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell
        title="مربی هوشمند AI"
        subtitle="تحلیل عمیق سبک معامله‌گری و پیشنهادهای شخصی برای رشد"
      >
        <div className="card-surface flex min-h-[300px] flex-col items-center justify-center gap-4 p-5">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" onClick={() => void loadPage()}>
            تلاش مجدد
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="مربی هوشمند AI"
      subtitle="تحلیل عمیق سبک معامله‌گری و پیشنهادهای شخصی برای رشد"
      actions={
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={regenerating || !modelId}
          onClick={() => void handleRegenerate()}
        >
          {regenerating ? (
            <Loader2 className="ml-1 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="ml-1 h-4 w-4" />
          )}
          تحلیل جدید
        </Button>
      }
    >
      <div className="card-surface p-5">
        <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">مدل مربی هوشمند</div>
              <div className="text-xs text-muted-foreground">
                {activeModel?.desc || "مدل تحلیل را انتخاب کنید"}
              </div>
            </div>
          </div>

          <Select value={modelId} onValueChange={setModelId} disabled={!models.length || regenerating}>
            <SelectTrigger className="bg-secondary/60 md:max-w-sm">
              <SelectValue placeholder="انتخاب مدل" />
            </SelectTrigger>
            <SelectContent>
              {models.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  <div className="flex flex-col text-right">
                    <span className="font-medium">{item.name}</span>
                    {item.desc ? (
                      <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                    ) : null}
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

      {!analysis ? (
        <div className="card-surface mt-6 flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
          <Sparkles className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            هنوز تحلیلی برای حساب شما ساخته نشده است. مدل را انتخاب کنید و تحلیل جدید بسازید.
          </p>
        </div>
      ) : (
        <>
          {heroText ? (
            <div className="card-surface hero-bg mt-6 overflow-hidden p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">گزارش مربی</h2>
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                      <Brain className="ml-1 h-3 w-3" />
                      هوش مصنوعی
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{heroText}</p>
                </div>
              </div>
            </div>
          ) : null}

          {analysis.scores?.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {analysis.scores.map((score) => (
                <div key={score.label} className="card-surface p-5">
                  <div className="text-sm text-muted-foreground">{score.label}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tabular">{score.value}</span>
                    <span className="text-sm text-muted-foreground">/ ۱۰۰</span>
                  </div>
                  <Progress value={score.value} className="mt-3 h-1.5" />
                </div>
              ))}
            </div>
          ) : null}

          {analysis.strengths?.length || analysis.weaknesses?.length ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="card-surface p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">نقاط قوت</h3>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                    راهکار پایداری
                  </Badge>
                </div>
                <ul className="mt-4 space-y-4 text-sm">
                  {analysis.strengths.map((item) => (
                    <li key={item.title} className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.keepDoing ? (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-background/40 p-2.5 text-xs text-foreground/90">
                          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>
                            <span className="font-semibold text-primary">پایدار نگه‌داری:</span> {item.keepDoing}
                          </span>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-surface p-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h3 className="font-semibold">نقاط ضعف</h3>
                  <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                    راهکار پیشنهادی
                  </Badge>
                </div>
                <ul className="mt-4 space-y-4 text-sm">
                  {analysis.weaknesses.map((item) => (
                    <li key={item.title} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <div className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.solution ? (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-background/40 p-2.5 text-xs text-foreground/90">
                          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                          <span>
                            <span className="font-semibold text-accent">راهکار:</span> {item.solution}
                          </span>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="card-surface mt-6 p-5">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">گزارش عملکرد</h3>
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                <Sparkles className="ml-1 h-3 w-3" />
                تولید‌شده با AI
              </Badge>
            </div>
            <Tabs defaultValue="weekly" className="mt-4">
              <TabsList className="bg-secondary/60">
                <TabsTrigger value="weekly">
                  <CalendarRange className="ml-1 h-3.5 w-3.5" />
                  هفتگی
                </TabsTrigger>
                <TabsTrigger value="daily">
                  <CalendarDays className="ml-1 h-3.5 w-3.5" />
                  روزانه
                </TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="mt-4 space-y-4">
                {analysis.weeklyReport?.range ? (
                  <div className="text-xs text-muted-foreground">
                    بازه: <span className="tabular">{analysis.weeklyReport.range}</span>
                  </div>
                ) : null}
                {analysis.weeklyReport?.summary ? (
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {analysis.weeklyReport.summary}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">گزارش هفتگی هنوز آماده نیست.</p>
                )}
                {analysis.weeklyReport?.stats?.length ? (
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {analysis.weeklyReport.stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-border bg-secondary/40 p-3">
                        <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                        <div className="mt-1 text-sm font-bold tabular">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {analysis.weeklyReport?.highlights?.length ? (
                  <ul className="space-y-2 text-sm">
                    {analysis.weeklyReport.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </TabsContent>

              <TabsContent value="daily" className="mt-4 space-y-4">
                {analysis.dailyReport?.date ? (
                  <div className="text-xs text-muted-foreground">
                    تاریخ: <span className="tabular">{analysis.dailyReport.date}</span>
                  </div>
                ) : null}
                {analysis.dailyReport?.summary ? (
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {analysis.dailyReport.summary}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">گزارش روزانه هنوز آماده نیست.</p>
                )}
                {analysis.dailyReport?.stats?.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {analysis.dailyReport.stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-border bg-secondary/40 p-3">
                        <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                        <div className="mt-1 text-sm font-bold tabular">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {analysis.dailyReport?.highlights?.length ? (
                  <ul className="space-y-2 text-sm">
                    {analysis.dailyReport.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="card-surface p-5 lg:col-span-2">
              <h3 className="font-semibold">الگوهای رفتاری شناسایی‌شده</h3>
              <p className="text-xs text-muted-foreground">تعداد دفعات در ۳۰ روز اخیر</p>
              <div className="mt-4 h-64">
                {analysis.behaviors?.length ? (
                  <ResponsiveContainer>
                    <BarChart data={analysis.behaviors} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 255)" horizontal={false} />
                      <XAxis type="number" stroke="oklch(0.68 0.02 255)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="oklch(0.68 0.02 255)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.185 0.022 255)",
                          border: "1px solid oklch(0.28 0.02 255)",
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {analysis.behaviors.map((item, index) => (
                          <Cell key={item.name} fill={index % 2 ? "oklch(0.65 0.23 25)" : "oklch(0.8 0.14 82)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted-foreground">
                    الگویی ثبت نشده است
                  </div>
                )}
              </div>
            </div>

            <div className="card-surface p-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">تمرین‌های پیشنهادی</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                {analysis.suggestions?.length ? (
                  analysis.suggestions.map((item, index) => (
                    <li key={item} className="flex items-start gap-2 rounded-lg border border-border bg-secondary/40 p-3">
                      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-[10px] font-bold text-primary tabular">
                        {index + 1}
                      </div>
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">تمرین پیشنهادی ثبت نشده است.</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}