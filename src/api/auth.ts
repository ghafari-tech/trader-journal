
import { apiFetch } from "@/api/client";
import { setAuthTokens } from "@/lib/auth-storage";
import {
  setCurrentUser,
  clearCurrentUser,
} from "@/lib/current-user";

type AuthPayload = {
  access?: string;
  access_token?: string;
  token?: string;

  refresh?: string;
  refresh_token?: string;

  first_name?: string;
  last_name?: string;

  user?: {
    first_name?: string;
    last_name?: string;
  };

  data?: AuthPayload;
};

type CurrentUserInfo = {
  first_name: string;
  last_name: string;
};

function pickTokens(
  payload: unknown,
): {
  access: string;
  refresh?: string;
} {
  const root = (payload ?? {}) as AuthPayload;

  const nested = root.data ?? root;

  const access =
    nested.access ??
    nested.access_token ??
    nested.token;

  const refresh =
    nested.refresh ??
    nested.refresh_token;

  if (
    !access ||
    typeof access !== "string"
  ) {
    throw new Error(
      "پاسخ ورود توکن معتبری نداشت",
    );
  }

  return {
    access,
    refresh:
      typeof refresh === "string"
        ? refresh
        : undefined,
  };
}

function pickCurrentUser(
  payload: unknown,
): CurrentUserInfo | null {
  const root = (payload ?? {}) as AuthPayload;

  const data = root.data ?? root;

  const user = data.user ?? data;

  const firstName =
    typeof user.first_name === "string"
      ? user.first_name.trim()
      : "";

  const lastName =
    typeof user.last_name === "string"
      ? user.last_name.trim()
      : "";

  if (!firstName && !lastName) {
    return null;
  }

  return {
    first_name: firstName,
    last_name: lastName,
  };
}

/**
 * ورود
 */
export async function login(
  email: string,
  password: string,
) {
  clearCurrentUser();

  const payload =
    await apiFetch<unknown>(
      "/login/",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      },
      {
        auth: false,
      },
    );

  const tokens =
    pickTokens(payload);

  setAuthTokens(
    tokens.access,
    tokens.refresh,
  );

  const currentUser =
    pickCurrentUser(payload);

  if (currentUser) {
    setCurrentUser(currentUser);
  }

  return tokens;
}

/**
 * ثبت‌نام
 *
 * این API حساب را ایجاد می‌کند
 * و کد تأیید را به ایمیل کاربر می‌فرستد.
 */
export async function signup(input: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  clearCurrentUser();

  const payload =
    await apiFetch<{
      message?: string;
      email?: string;
    }>(
      "/signup/",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      {
        auth: false,
      },
    );

  /*
   * در این مرحله هنوز نباید کاربر را
   * وارد حساب کنیم یا current user را ذخیره کنیم.
   *
   * چون API می‌گوید:
   * Verification code sent successfully.
   */

  return payload;
}

/**
 * تأیید کد ثبت‌نام
 *
 * POST /verify/register/
 */
export async function verifyRegister(
  email: string,
  code: string,
) {
  const payload =
    await apiFetch<{
      message?: string;
    }>(
      "/verify/register/",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
        }),
      },
      {
        auth: false,
      },
    );

  return payload;
}

