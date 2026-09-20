import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { achievements } from "@/lib/mock-data";

export const Route = createFileRoute("/app/achievements")({
  head: () => ({ meta: [{ title: "نشان‌ها" }] }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const earned = achievements.filter((a) => a.earned).length;
  return (
    <AppShell title="نشان‌ها" subtitle={`${earned} از ${achievements.length} نشان کسب‌شده`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <div key={a.id} className={`card-surface p-6 text-center transition-all ${a.earned ? "hover:border-primary/40" : "opacity-60"}`}>
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${a.earned ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]" : "bg-secondary text-muted-foreground"}`}>
              {a.earned ? <Trophy className="h-7 w-7" /> : <Lock className="h-6 w-6" />}
            </div>
            <h3 className="mt-4 font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            <Badge variant="outline" className={`mt-4 ${a.earned ? "border-primary/40 bg-primary/10 text-primary" : ""}`}>
              {a.earned ? "کسب‌شده" : "قفل"}
            </Badge>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
