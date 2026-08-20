import { apiFetch } from "@/api/client";
import { setAuthTokens } from "@/lib/auth-storage";

type AuthPayload = {
  access?: string;
  access_token?: string;
  token?: string;
  refresh?: string;
  refresh_token?: string;
  data?: AuthPayload;
};

function pickTokens(payload: unknown): { access: string; refresh?: string } {
  const root = (payload ?? {}) as AuthPayload;
  const nested = root.data ?? root;
  const access = nested.access ?? nested.access_token ?? nested.token;
  const refresh = nested.refresh ?? nested.refresh_token;

  if (!access || typeof access !== "string") {
    throw new Error("پاسخ ورود توکن معتبری نداشت");
  }

  return {
    access,
    refresh: typeof refresh === "string" ? refresh : undefined,
  };
}

export async function login(email: string, password: string) {
  const payload = await apiFetch<unknown>(
    "/login/",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    { auth: false },
  );

  const tokens = pickTokens(payload);
  setAuthTokens(tokens.access, tokens.refresh);
  return tokens;
}

export async function signup(input: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  const payload = await apiFetch<unknown>(
    "/signup/",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { auth: false },
  );

  try {
    const tokens = pickTokens(payload);
    setAuthTokens(tokens.access, tokens.refresh);
  } catch {
    // برخی APIها بعد از ثبت‌نام توکن نمی‌دهند؛ کاربر باید وارد شود.
  }
}
