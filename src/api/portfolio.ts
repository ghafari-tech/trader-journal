import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface Portfolio {
  id: string | number;
  name: string;
  broker: string;
  type?: string;

  balance: number;
  initial: number;

  leverage: string;
  currency: string;
  trades: number;
  status: string;

  // ممکن است API این فیلدها را برگرداند
  is_archived?: boolean;
  archived?: boolean;
}

export interface CreatePortfolioInput {
  name: string;
  broker: string;
  balance: number;
  currency: string;
  leverage: string;
}

export interface UpdatePortfolioInput {
  name: string;
  broker: string;
  balance: number;
  currency: string;
  leverage: string;
}

function getToken(): string {
  const token = getAccessToken();

  if (!token) {
    throw new Error(
      "توکن ورود پیدا نشد. لطفاً دوباره وارد حساب شوید.",
    );
  }

  return token;
}

function getErrorMessage(
  data: unknown,
  fallback: string,
): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof (data as { detail?: unknown }).detail ===
      "string"
  ) {
    return (data as { detail: string }).detail;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message ===
      "string"
  ) {
    return (data as { message: string }).message;
  }

  return fallback;
}

/**
 * دریافت تمام پرتفولیوهای کاربر
 */
export async function getPortfolios(): Promise<Portfolio[]> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/app/portfolio/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log(
    "GET /app/portfolio/ response:",
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در دریافت پرتفولیوها: ${response.status}`,
      ),
    );
  }

  // حالت 1
  if (Array.isArray(data)) {
    return data as Portfolio[];
  }

  // حالت 2
  if (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray(
      (data as { results?: unknown }).results,
    )
  ) {
    return (data as { results: Portfolio[] }).results;
  }

  // حالت 3
  if (
    typeof data === "object" &&
    data !== null &&
    "portfolios" in data &&
    Array.isArray(
      (data as { portfolios?: unknown }).portfolios,
    )
  ) {
    return (
      data as { portfolios: Portfolio[] }
    ).portfolios;
  }

  // حالت 4
  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray(
      (data as { data?: unknown }).data,
    )
  ) {
    return (data as { data: Portfolio[] }).data;
  }

  console.warn(
    "ساختار پاسخ GET پرتفولیوها شناخته نشد:",
    data,
  );

  return [];
}

/**
 * ساخت پرتفولیو جدید
 *
 * POST /app/portfolio/add/
 */
export async function createPortfolio(
  input: CreatePortfolioInput,
): Promise<Portfolio | null> {
  const token = getToken();

  const body = {
    name: input.name,
    broker: input.broker,
    balance: String(input.balance),
    currency: input.currency,
    leverage: input.leverage,
  };

  console.log(
    "POST /app/portfolio/add/ body:",
    body,
  );

  const response = await fetch(
    `${API_BASE}/app/portfolio/add/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log(
    "POST /app/portfolio/add/ response:",
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در ساخت پرتفولیو: ${response.status}`,
      ),
    );
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "portfolio" in data &&
    typeof (data as { portfolio?: unknown })
      .portfolio === "object" &&
    (data as { portfolio?: unknown })
      .portfolio !== null
  ) {
    return (
      data as { portfolio: Portfolio }
    ).portfolio;
  }

  return null;
}

/**
 * ویرایش پرتفولیو
 *
 * PUT /app/portfolio/portfolio/{id}/edit/
 */
export async function updatePortfolio(
  id: string | number,
  input: UpdatePortfolioInput,
): Promise<Portfolio | null> {
  const token = getToken();

  const body = {
    name: input.name,
    broker: input.broker,
    balance: String(input.balance),
    currency: input.currency,
    leverage: input.leverage,
  };

  console.log(
    `PUT /app/portfolio/portfolio/${id}/edit/ body:`,
    body,
  );

  const response = await fetch(
    `${API_BASE}/app/portfolio/portfolio/${id}/edit/`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log(
    `PUT /app/portfolio/portfolio/${id}/edit/ response:`,
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در ویرایش پرتفولیو: ${response.status}`,
      ),
    );
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "portfolio" in data &&
    typeof (data as { portfolio?: unknown })
      .portfolio === "object" &&
    (data as { portfolio?: unknown })
      .portfolio !== null
  ) {
    return (
      data as { portfolio: Portfolio }
    ).portfolio;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data)
  ) {
    return data as Portfolio;
  }

  return null;
}

/**
 * آرشیو کردن پرتفولیو
 *
 * PATCH /app/portfolio/portfolio/{id}/archive/
 *
 * نکته:
 * این عملیات DELETE نیست.
 * پرتفولیو از دیتابیس حذف نمی‌شود و فقط آرشیو می‌شود.
 */
export async function archivePortfolio(
  id: string | number,
): Promise<void> {
  const token = getToken();

  console.log(
    `PATCH /app/portfolio/portfolio/${id}/archive/`,
  );

  const response = await fetch(
    `${API_BASE}/app/portfolio/portfolio/${id}/archive/`,
    {
      method: "PATCH",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log(
    `PATCH /app/portfolio/portfolio/${id}/archive/ response:`,
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در آرشیو پرتفولیو: ${response.status}`,
      ),
    );
  }
}

/**
 * حذف دائمی پرتفولیو
 */
export async function deletePortfolio(
  id: string | number,
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/app/portfolio/portfolio/${id}/delete/`,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log(
    `DELETE /app/portfolio/portfolio/${id}/delete/ response:`,
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در حذف پرتفولیو: ${response.status}`,
      ),
    );
  }
}