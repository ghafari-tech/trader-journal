import { apiFetch } from "@/api/client";

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  trigger_type: string;
  trigger_count: number;
  order: number;
  is_finished: boolean;
  progress: number;
  finished_at: string | null;
}

interface AchievementsResponse {
  badges: Achievement[];
}

export async function getAchievements(): Promise<Achievement[]> {
  const data = await apiFetch<AchievementsResponse>(
    "/app/achievements/list/",
  );

  return Array.isArray(data?.badges) ? data.badges : [];
}