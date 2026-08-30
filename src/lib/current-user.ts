const CURRENT_USER_KEY = "trader_journal_current_user";

export type CurrentUser = {
  first_name: string;
  last_name: string;
};

/**
 * ذخیره اطلاعات کاربر فعلی
 */
export function setCurrentUser(user: CurrentUser): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
      }),
    );
  } catch (error) {
    console.error(
      "Set current user error:",
      error,
    );
  }
}

/**
 * دریافت کاربر فعلی
 */
export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedUser =
      localStorage.getItem(CURRENT_USER_KEY);

    if (!savedUser) {
      return null;
    }

    const parsed = JSON.parse(
      savedUser,
    ) as Partial<CurrentUser>;

    return {
      first_name:
        typeof parsed.first_name === "string"
          ? parsed.first_name
          : "",
      last_name:
        typeof parsed.last_name === "string"
          ? parsed.last_name
          : "",
    };
  } catch (error) {
    console.error(
      "Get current user error:",
      error,
    );

    return null;
  }
}

/**
 * دریافت نام کامل کاربر
 */
export function getCurrentUserFullName(): string {
  const user = getCurrentUser();

  if (!user) {
    return "کاربر";
  }

  const fullName =
    `${user.first_name} ${user.last_name}`.trim();

  return fullName || "کاربر";
}

/**
 * حذف اطلاعات کاربر فعلی
 */
export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error(
      "Clear current user error:",
      error,
    );
  }
}