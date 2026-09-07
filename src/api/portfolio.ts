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

  is_archived?: boolean;
  archived?: boolean;

  profit_loss?: number | string;
  transactions_count?: number;
  profit_percentage?: number | string;

  is_active?: boolean;
  mt_connection?: boolean;

  created_at?: string;
  updated_at?: string;
  user?: number;
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
    typeof (data as { detail?: unknown }).detail === "string"
  ) {
    return (data as { detail: string }).detail;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error?: unknown }).error === "string"
  ) {
    return (data as { error: string }).error;
  }

  return fallback;
}

async function parseResponse(
  response: Response,
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * دریافت تمام پرتفولیوهای کاربر
 *
 * GET /app/portfolio/
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

  const data = await parseResponse(response);

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

  if (Array.isArray(data)) {
    return data as Portfolio[];
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray(
      (data as { results?: unknown }).results,
    )
  ) {
    return (
      data as { results: Portfolio[] }
    ).results;
  }

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

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray(
      (data as { data?: unknown }).data,
    )
  ) {
    return (
      data as { data: Portfolio[] }
    ).data;
  }

  console.warn(
    "ساختار پاسخ GET پرتفولیوها شناخته نشد:",
    data,
  );

  return [];
}

/**
 * دریافت پرتفولیوهای آرشیو شده
 *
 * GET /app/portfolio/archive/
 */
export async function getArchivedPortfolios(): Promise<
  Portfolio[]
> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/app/portfolio/archive/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await parseResponse(response);

  console.log(
    "GET /app/portfolio/archive/ response:",
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در دریافت پرتفولیوهای آرشیو شده: ${response.status}`,
      ),
    );
  }

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

  if (Array.isArray(data)) {
    return data as Portfolio[];
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray(
      (data as { results?: unknown }).results,
    )
  ) {
    return (
      data as { results: Portfolio[] }
    ).results;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray(
      (data as { data?: unknown }).data,
    )
  ) {
    return (
      data as { data: Portfolio[] }
    ).data;
  }

  console.warn(
    "ساختار پاسخ GET /app/portfolio/archive/ شناخته نشد:",
    data,
  );

  return [];
}

/**
 * فعال‌سازی پرتفولیو
 *
 * GET /app/portfolio/portfolio/{id}/active/
 */
export async function activatePortfolio(
  id: string | number,
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/app/portfolio/portfolio/${id}/active/`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await parseResponse(response);

  console.log(
    `GET /app/portfolio/portfolio/${id}/active/ response:`,
    data,
  );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در فعال‌سازی پرتفولیو: ${response.status}`,
      ),
    );
  }
}

/**
 * ساخت پرتفولیو
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

  const data = await parseResponse(response);

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
    typeof (data as { portfolio?: unknown }).portfolio ===
      "object" &&
    (data as { portfolio?: unknown }).portfolio !== null
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

  const data = await parseResponse(response);

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
    typeof (data as { portfolio?: unknown }).portfolio ===
      "object" &&
    (data as { portfolio?: unknown }).portfolio !== null
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
 * آرشیو پرتفولیو
 *
 * PATCH /app/portfolio/portfolio/{id}/archive/
 */
export async function archivePortfolio(
  id: string | number,
): Promise<void> {
  const token = getToken();

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

  const data = await parseResponse(response);

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
 *
 * DELETE /app/portfolio/portfolio/{id}/delete/
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

  const data = await parseResponse(response);

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