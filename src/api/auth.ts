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

  const nested =
    root.data ?? root;

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

  const data =
    root.data ?? root;

  const user =
    data.user ?? data;

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
  /*
   * قبل از ورود، اطلاعات کاربر قبلی را پاک می‌کنیم
   * تا اسم کاربر قبلی روی حساب جدید باقی نماند.
   */
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

  /*
   * اگر API هنگام login اطلاعات نام کاربر
   * را برگرداند، همان را ذخیره می‌کنیم.
   */
  const currentUser =
    pickCurrentUser(payload);

  if (currentUser) {
    setCurrentUser(currentUser);
  }

  return tokens;
}

/**
 * ثبت‌نام
 */
export async function signup(input: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  /*
   * اطلاعات کاربر قبلی را پاک می‌کنیم.
   */
  clearCurrentUser();

  const payload =
    await apiFetch<unknown>(
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
   * چون اطلاعات نام و نام خانوادگی
   * را همین‌جا از فرم ثبت‌نام داریم،
   * بلافاصله کاربر فعلی را ذخیره می‌کنیم.
   */
  setCurrentUser({
    first_name:
      input.first_name.trim(),
    last_name:
      input.last_name.trim(),
  });

  /*
   * بعضی APIها بعد از signup توکن می‌دهند
   * و بعضی‌ها نمی‌دهند.
   */
  try {
    const tokens =
      pickTokens(payload);

    setAuthTokens(
      tokens.access,
      tokens.refresh,
    );

    return tokens;
  } catch {
    /*
     * اگر signup توکن نداد،
     * مشکلی نیست؛ کاربر باید login کند.
     */
    return null;
  }
}