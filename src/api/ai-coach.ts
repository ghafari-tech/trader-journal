import { ApiError, apiFetch } from "@/api/client";

export type AiCoachModel = {
  id: number;
  name: string;
  desc: string;
};

export type AiScore = {
  label: string;
  value: number;
};

export type AiStrength = {
  title: string;
  keepDoing: string;
};

export type AiWeakness = {
  title: string;
  solution: string;
};

export type AiBehavior = {
  name: string;
  count: number;
};

export type AiStat = {
  label: string;
  value: string;
};

export type AiPeriodReport = {
  range: string;
  date: string;
  summary: string;
  stats: AiStat[];
  highlights: string[];
};

export type AiCoachAnalysis = {
  summary: string;
  modelId: number | null;
  scores: AiScore[];
  strengths: AiStrength[];
  weaknesses: AiWeakness[];
  behaviors: AiBehavior[];
  suggestions: string[];
  dailyReport: AiPeriodReport;
  weeklyReport: AiPeriodReport;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function maybeParseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const text = value.trim();
  if (
    !(
      (text.startsWith("{") && text.endsWith("}")) ||
      (text.startsWith("[") && text.endsWith("]"))
    )
  ) {
    return value;
  }

  try {
    return JSON.parse(text);
  } catch {
    return value;
  }
}

function asList(payload: unknown, nestedKeys: string[] = []): unknown[] {
  const parsed = maybeParseJson(payload);
  if (Array.isArray(parsed)) return parsed;

  if (!isRecord(parsed)) return [];

  for (const key of nestedKeys) {
    const nested = maybeParseJson(parsed[key]);
    if (Array.isArray(nested)) return nested;
  }

  return [];
}

function unwrap(payload: unknown): Record<string, unknown> {
  const parsed = maybeParseJson(payload);
  if (typeof parsed === "string" && parsed.trim()) {
    return { summary: parsed.trim() };
  }

  if (!isRecord(parsed)) return {};

  for (const key of [
    "data",
    "analysis",
    "ai_analysis",
    "coach",
    "report",
    "result",
    "results",
  ]) {
    const nested = maybeParseJson(parsed[key]);
    if (isRecord(nested)) return { ...parsed, ...nested };
    if (Array.isArray(nested) && isRecord(nested[0])) {
      return { ...parsed, ...nested[0] };
    }
    if (typeof nested === "string" && nested.trim()) {
      return { ...parsed, summary: nested.trim() };
    }
  }

  return parsed;
}

function pickString(
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return fallback;
}

function pickNumber(
  record: Record<string, unknown>,
  keys: string[],
  fallback = 0,
): number {
  for (const key of keys) {
    const value = record[key];
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(num)) return num;
  }
  return fallback;
}

function toTextList(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (!isRecord(item)) return "";
      return pickString(item, ["text", "title", "message", "highlight", "value"]);
    })
    .filter(Boolean);
}

const SCORE_LABELS: Record<string, string> = {
  discipline: "نظم معاملاتی",
  trading_discipline: "نظم معاملاتی",
  risk: "مدیریت سرمایه",
  risk_management: "مدیریت سرمایه",
  psychology: "روانشناسی",
  plan: "پایبندی به پلن",
  plan_adherence: "پایبندی به پلن",
  adherence: "پایبندی به پلن",
};

const STAT_LABELS: Record<string, string> = {
  total_trades: "کل معاملات",
  trades: "کل معاملات",
  trade_count: "تعداد معامله",
  net_profit: "سود خالص",
  total_reward: "سود خالص",
  profit: "سود خالص",
  win_rate: "Win Rate",
  profit_factor: "Profit Factor",
  best_symbol: "بهترین نماد",
  worst_symbol: "بدترین نماد",
  plan_adherence: "پایبندی به پلن",
  adherence: "پایبندی به پلن",
};

function formatStatValue(value: unknown, key: string): string {
  if (typeof value === "string") return value;
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";

  if (key.includes("rate") || key.includes("adherence")) {
    return `${value}٪`;
  }

  if (
    key.includes("profit") ||
    key.includes("reward") ||
    key.includes("loss")
  ) {
    const abs = Math.abs(value).toLocaleString("en-US");
    return `${value >= 0 ? "+" : "-"}$${abs}`;
  }

  return String(value);
}

function normalizeScores(value: unknown): AiScore[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!isRecord(item)) return null;
        return {
          label: pickString(item, ["label", "title", "name", "metric"]),
          value: pickNumber(item, ["value", "score", "percent"]),
        };
      })
      .filter((item): item is AiScore => Boolean(item?.label));
  }

  if (!isRecord(value)) return [];

  return Object.entries(value)
    .map(([key, raw]) => ({
      label: SCORE_LABELS[key] ?? key,
      value: typeof raw === "number" ? raw : Number(raw),
    }))
    .filter((item) => Number.isFinite(item.value));
}

function normalizeStrengths(value: unknown): AiStrength[] {
  return asList(value).flatMap((item) => {
    if (typeof item === "string") {
      return [{ title: item, keepDoing: "" }];
    }
    if (!isRecord(item)) return [];
    return [
      {
        title: pickString(item, ["title", "name", "text", "strength"]),
        keepDoing: pickString(item, [
          "keep_doing",
          "keepDoing",
          "advice",
          "sustain",
          "description",
        ]),
      },
    ];
  }).filter((item) => item.title);
}

function normalizeWeaknesses(value: unknown): AiWeakness[] {
  return asList(value).flatMap((item) => {
    if (typeof item === "string") {
      return [{ title: item, solution: "" }];
    }
    if (!isRecord(item)) return [];
    return [
      {
        title: pickString(item, ["title", "name", "text", "weakness"]),
        solution: pickString(item, [
          "solution",
          "advice",
          "fix",
          "recommendation",
          "description",
        ]),
      },
    ];
  }).filter((item) => item.title);
}

function normalizeBehaviors(value: unknown): AiBehavior[] {
  if (isRecord(value) && !("name" in value) && !("title" in value)) {
    const entries = Object.entries(value);
    if (
      entries.length &&
      entries.every(
        ([, raw]) =>
          raw == null || typeof raw === "number" || typeof raw === "string",
      )
    ) {
      return entries.map(([name, count]) => ({
        name,
        count: Number(count) || 0,
      }));
    }
  }

  return asList(value).flatMap((item) => {
    if (!isRecord(item)) return [];
    return [
      {
        name: pickString(item, ["name", "title", "behavior", "label"]),
        count: pickNumber(item, ["count", "value", "occurrences"]),
      },
    ];
  }).filter((item) => item.name);
}

function normalizeStats(value: unknown): AiStat[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (!isRecord(item)) return [];
      const label = pickString(item, ["label", "title", "name"]);
      if (!label) return [];
      return [
        {
          label,
          value: pickString(item, ["value", "text", "amount"], "—"),
        },
      ];
    });
  }

  if (!isRecord(value)) return [];

  return Object.entries(value)
    .filter(([, raw]) => raw !== null && typeof raw !== "object")
    .map(([key, raw]) => ({
      label: STAT_LABELS[key] ?? key,
      value: formatStatValue(raw, key),
    }));
}

function normalizeReport(
  value: unknown,
  fallbackSummary = "",
): AiPeriodReport {
  const record = isRecord(value) ? value : {};
  return {
    range: pickString(record, ["range", "period", "from_to", "week_range"]),
    date: pickString(record, ["date", "day", "created_at"]),
    summary: pickString(record, ["summary", "text", "message", "content"], fallbackSummary),
    stats: normalizeStats(record.stats ?? record.metrics),
    highlights: toTextList(
      record.highlights ?? record.points ?? record.items ?? record.notes,
    ),
  };
}

export function normalizeModels(payload: unknown): AiCoachModel[] {
  const parsed = maybeParseJson(payload);
  let list = asList(parsed, ["models", "results", "data"]);

  if (
    !list.length &&
    isRecord(parsed) &&
    ("id" in parsed || "name" in parsed || "models_id" in parsed)
  ) {
    list = [parsed];
  }

  return list.flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const id = pickNumber(item, ["id", "models_id", "model_id"], index + 1);
    const name = pickString(item, ["name", "title", "label"], `مدل ${id}`);
    return [
      {
        id,
        name,
        desc: pickString(item, ["desc", "description", "details"]),
      },
    ];
  });
}

function isMeaningfulAnalysis(analysis: AiCoachAnalysis): boolean {
  return Boolean(
    analysis.summary ||
      analysis.scores.length ||
      analysis.strengths.length ||
      analysis.weaknesses.length ||
      analysis.behaviors.length ||
      analysis.suggestions.length ||
      analysis.dailyReport.summary ||
      analysis.weeklyReport.summary ||
      analysis.dailyReport.stats.length ||
      analysis.weeklyReport.stats.length ||
      analysis.dailyReport.highlights.length ||
      analysis.weeklyReport.highlights.length,
  );
}

export function normalizeAnalysis(payload: unknown): AiCoachAnalysis | null {
  if (payload == null) return null;

  const root = unwrap(payload);
  if (Object.keys(root).length === 0) return null;

  const weekly = normalizeReport(
    maybeParseJson(root.weekly_report ?? root.weeklyReport ?? root.weekly),
  );
  const daily = normalizeReport(
    maybeParseJson(root.daily_report ?? root.dailyReport ?? root.daily),
  );
  const summary = pickString(
    root,
    ["summary", "coach_message", "hero", "content", "text"],
    weekly.summary || daily.summary,
  );

  const analysis: AiCoachAnalysis = {
    summary,
    modelId:
      pickNumber(
        root,
        ["models_id", "model_id", "modelId"],
        Number.NaN,
      ) ||
      (isRecord(root.model)
        ? pickNumber(root.model, ["id", "models_id"], Number.NaN)
        : Number.NaN) ||
      null,
    scores: normalizeScores(
      maybeParseJson(root.scores ?? root.metrics),
    ),
    strengths: normalizeStrengths(
      maybeParseJson(root.strengths ?? root.strong_points),
    ),
    weaknesses: normalizeWeaknesses(
      maybeParseJson(root.weaknesses ?? root.weak_points),
    ),
    behaviors: normalizeBehaviors(
      maybeParseJson(root.behaviors ?? root.patterns),
    ),
    suggestions: toTextList(
      maybeParseJson(
        root.suggestions ??
          root.exercises ??
          root.practices ??
          root.recommendations,
      ),
    ),
    dailyReport: daily,
    weeklyReport: weekly,
  };

  return isMeaningfulAnalysis(analysis) ? analysis : null;
}

export async function getAiCoachModels(): Promise<AiCoachModel[]> {
  try {
    const payload = await apiFetch<unknown>("/app/ai-coach/models/", {
      method: "GET",
    });
    return normalizeModels(payload);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 204)) {
      return [];
    }
    throw error;
  }
}

export async function getAiCoachAnalysis(): Promise<AiCoachAnalysis | null> {
  try {
    const payload = await apiFetch<unknown>("/app/ai-coach/", {
      method: "GET",
    });
    return normalizeAnalysis(payload);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 204)) {
      return null;
    }
    throw error;
  }
}

export async function regenerateAiCoachAnalysis(
  modelsId: number,
): Promise<AiCoachAnalysis | null> {
  const payload = await apiFetch<unknown>("/app/ai-coach/regenerate/", {
    method: "POST",
    body: JSON.stringify({ models_id: modelsId }),
  });

  return normalizeAnalysis(payload) ?? getAiCoachAnalysis();
}

