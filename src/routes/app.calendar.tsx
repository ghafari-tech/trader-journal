import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { calendarDays } from "@/lib/mock-data";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({ meta: [{ title: "تقویم معاملاتی" }] }),
  component: CalendarPage,
});

const weekdays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function CalendarPage() {
  const totalPnl = calendarDays.reduce((s, d) => s + d.pnl, 0);
  const winDays = calendarDays.filter((d) => d.day && d.pnl > 0).length;
  const loseDays = calendarDays.filter((d) => d.day && d.pnl < 0).length;

  return (
    <AppShell
      title="تقویم معاملاتی"
      subtitle="نقشه رنگی روزهای سودده و زیان‌ده — آبان ۱۴۰۳"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          <div className="min-w-24 text-center font-medium">آبان ۱۴۰۳</div>
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card-surface p-4">
          <div className="text-xs text-muted-foreground">مجموع ماه</div>
          <div className={`mt-2 text-2xl font-bold tabular ${totalPnl >= 0 ? "gain" : "loss"}`}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}
          </div>
        </div>
        <div className="card-surface p-4">
          <div className="text-xs text-muted-foreground">روزهای سودده</div>
          <div className="mt-2 text-2xl font-bold tabular gain">{winDays}</div>
        </div>
        <div className="card-surface p-4">
          <div className="text-xs text-muted-foreground">روزهای زیان‌ده</div>
          <div className="mt-2 text-2xl font-bold tabular loss">{loseDays}</div>
        </div>
        <div className="card-surface p-4">
          <div className="text-xs text-muted-foreground">بهترین روز</div>
          <div className="mt-2 text-2xl font-bold tabular gain">
            +${Math.max(...calendarDays.map((d) => d.pnl)).toFixed(0)}
          </div>
        </div>
      </div>

      <div className="card-surface mt-6 p-6">
        <div className="grid grid-cols-7 gap-2">
          {weekdays.map((w) => (
            <div key={w} className="pb-2 text-center text-xs font-medium text-muted-foreground">{w}</div>
          ))}
          {calendarDays.map((c, i) => {
            if (!c.day) return <div key={i} className="aspect-square" />;
            const intensity = Math.min(Math.abs(c.pnl) / 800, 1);
            const bg = c.pnl > 0
              ? `oklch(0.4 ${0.1 * intensity + 0.05} 155 / ${0.3 + intensity * 0.5})`
              : c.pnl < 0
                ? `oklch(0.4 ${0.15 * intensity + 0.05} 25 / ${0.3 + intensity * 0.5})`
                : "oklch(0.22 0.02 255)";
            return (
              <div
                key={i}
                className="aspect-square rounded-lg border border-border p-2 transition-all hover:scale-105 hover:border-primary/50"
                style={{ background: bg }}
              >
                <div className="text-xs text-foreground/80 tabular">{c.day}</div>
                {c.pnl !== 0 && (
                  <>
                    <div className={`mt-2 text-xs font-bold tabular ${c.pnl > 0 ? "gain" : "loss"}`}>
                      {c.pnl > 0 ? "+" : ""}${c.pnl}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">{c.trades} معامله</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
