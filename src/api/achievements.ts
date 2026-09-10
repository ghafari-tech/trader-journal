import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface Achievement {
  name: string;
  description: string;
  is_acquisition: boolean;
}

interface AchievementsResponse {
  badges: Achievement[];
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "خطایی در دریافت نشان‌ها رخ داد.";

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data?.detail) && data.detail.length > 0) {
        message =
          data.detail[0]?.msg ||
          data.detail[0]?.message ||
          message;
      }
    } catch {
      // اگر پاسخ JSON نبود، پیام پیش‌فرض استفاده می‌شود
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getAchievements(): Promise<Achievement[]> {
  const data = await apiFetch<AchievementsResponse>("/app/achievements/");

  return Array.isArray(data?.badges) ? data.badges : [];
}