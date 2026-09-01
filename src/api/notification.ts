import { apiFetch } from "@/api/client";

export type Notification = {
  id: number;
  title: string;
  body: string;
  icon?: string | null;
  is_read: boolean;
  is_active: boolean;
  created_at: string;
  user: number;
};

type NotificationApiResponse = {
  notifications: Notification[];
};

/**
 * دریافت اعلان‌های کاربر
 *
 * GET /notification/
 */
export async function getNotifications(): Promise<Notification[]> {
  const response =
    await apiFetch<NotificationApiResponse>(
      "/notification/",
      {
        method: "GET",
      },
    );

  return Array.isArray(response?.notifications)
    ? response.notifications
    : [];
}