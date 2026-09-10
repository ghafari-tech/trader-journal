import { createFileRoute } from "@tanstack/react-router";
import { Lock, Trophy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAchievements,
  type Achievement,
} from "@/api/achievements";

export const Route = createFileRoute("/app/achievements")({
  head: () => ({
    meta: [{ title: "نشان‌ها" }],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = useCallback(async (isRefresh = false) => {
    try {
      setError(null);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAchievements();
      setAchievements(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "دریافت نشان‌ها با خطا مواجه شد.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAchievements();
  }, [loadAchievements]);

  const earned = achievements.filter(
    (achievement) => achievement.is_acquisition,
  ).length;

  return (
    <AppShell
      title="نشان‌ها"
      subtitle={`${earned} از ${achievements.length} نشان کسب‌شده`}
    >
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <RefreshCw className="h-7 w-7 animate-spin text-primary" />
            <p>در حال دریافت نشان‌ها...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card-surface flex min-h-[250px] flex-col items-center justify-center p-6 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <Trophy className="h-7 w-7" />
          </div>

          <h3 className="mt-4 font-semibold">
            دریافت نشان‌ها ناموفق بود
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() => void loadAchievements(true)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`ml-2 h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            تلاش مجدد
          </Button>
        </div>
      ) : achievements.length === 0 ? (
        <div className="card-surface flex min-h-[250px] items-center justify-center p-6 text-center">
          <div>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Trophy className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-semibold">
              هنوز نشانی برای نمایش وجود ندارد
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              به‌محض اضافه شدن نشان‌ها، اینجا نمایش داده می‌شوند.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => {
            const earned = achievement.is_acquisition;

            return (
              <div
                key={`${achievement.name}-${index}`}
                className={`card-surface p-6 text-center transition-all ${
                  earned
                    ? "hover:border-primary/40"
                    : "opacity-60"
                }`}
              >
                <div
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${
                    earned
                      ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {earned ? (
                    <Trophy className="h-7 w-7" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>

                <h3 className="mt-4 font-semibold">
                  {achievement.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {achievement.description}
                </p>

                <Badge
                  variant="outline"
                  className={`mt-4 ${
                    earned
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  {earned ? "کسب‌شده" : "قفل"}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}