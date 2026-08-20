const ACCESS_KEY = "traderjournal.access";
const REFRESH_KEY = "traderjournal.refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setAuthTokens(access: string, refresh?: string | null) {
  window.localStorage.setItem(ACCESS_KEY, access);
  if (refresh) {
    window.localStorage.setItem(REFRESH_KEY, refresh);
  }
}

export function clearAuthTokens() {
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
