const CURRENT_USER_KEY = "trader_journal_current_user";

export type CurrentUser = {
  first_name: string;
  last_name: string;
};

export function setCurrentUser(user: CurrentUser): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;

  const savedUser = localStorage.getItem(CURRENT_USER_KEY);

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as CurrentUser;
  } catch {
    return null;
  }
}

export function getCurrentUserFullName(): string {
  const user = getCurrentUser();

  if (!user) {
    return "کاربر";
  }

  return `${user.first_name} ${user.last_name}`.trim();
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CURRENT_USER_KEY);
}