
import { apiFetch } from "@/api/client";
import { setCurrentUser } from "@/lib/current-user";

export type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  image_profile: string | null;
};

/**
 * دریافت اطلاعات کاربر فعلی از API
 *
 * GET /app/settings/user/
 */
export async function getUserProfile(): Promise<UserProfile> {
  const user = await apiFetch<UserProfile>(
    "/app/settings/user/",
    {
      method: "GET",
    },
    {
      auth: true,
    },
  );

  // برای استفاده سریع در بخش‌های دیگر برنامه
  setCurrentUser({
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
  });

  return user;
}
