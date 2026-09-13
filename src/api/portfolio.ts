
import { getAccessToken } from "@/lib/auth-storage";

const API_BASE = "/backend";

export interface Portfolio {
  id: string | number;
  name: string;
  broker: string;
  type?: string;

  balance: number;
  initial?: number;

  leverage: string;
  currency: string;

  trades?: number;
  transactions_count?: number;

  status?: string;

  is_archived?: boolean;
  archived?: boolean;

  profit_loss?: number;
  profit_percentage?: number;

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
    "detail" in data
  ) {
    const detail = (data as { detail?: unknown }).detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            "msg" in item
          ) {
            return String(
              (item as { msg?: unknown }).msg ?? "",
            );
          }

          return String(item);
        })
        .filter(Boolean)
        .join("، ");
    }
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data
  ) {
    const message = (
      data as { message?: unknown }
    ).message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data
  ) {
    const error = (
      data as { error?: unknown }
    ).error;

    if (typeof error === "string") {
      return error;
    }
  }

  if (typeof data === "string" && data.trim()) {
    return data;
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

function toNumber(
  value: unknown,
  fallback = 0,
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function normalizePortfolio(
  value: unknown,
): Portfolio {
  const item =
    typeof value === "object" &&
    value !== null
      ? (value as Record<string, unknown>)
      : {};

  const balance = toNumber(
    item.balance,
    0,
  );

  const profitLoss = toNumber(
    item.profit_loss,
    0,
  );

  const profitPercentage = toNumber(
    item.profit_percentage,
    0,
  );

  const transactionsCount = toNumber(
    item.transactions_count ??
      item.trades,
    0,
  );

  return {
    id:
      typeof item.id === "number" ||
      typeof item.id === "string"
        ? item.id
        : "",

    name: String(
      item.name ?? "",
    ),

    broker: String(
      item.broker ?? "",
    ),

    type:
      item.type != null
        ? String(item.type)
        : undefined,

    balance,

    initial:
      item.initial != null
        ? toNumber(item.initial)
        : undefined,

    leverage: String(
      item.leverage ?? "1:100",
    ),

    currency: String(
      item.currency ?? "USD",
    ),

    trades: transactionsCount,

    transactions_count:
      transactionsCount,

    status:
      item.status != null
        ? String(item.status)
        : undefined,

    is_archived:
      Boolean(item.is_archived),

    archived:
      Boolean(item.archived),

    profit_loss:
      profitLoss,

    profit_percentage:
      profitPercentage,

    is_active:
      item.is_active === true,

    mt_connection:
      item.mt_connection === true,

    created_at:
      item.created_at != null
        ? String(item.created_at)
        : undefined,

    updated_at:
      item.updated_at != null
        ? String(item.updated_at)
        : undefined,

    user:
      item.user != null
        ? toNumber(item.user)
        : undefined,
  };
}

function extractPortfolioList(
  data: unknown,
): Portfolio[] {
  if (Array.isArray(data)) {
    return data.map(
      normalizePortfolio,
    );
  }

  if (
    typeof data === "object" &&
    data !== null
  ) {
    const object =
      data as Record<string, unknown>;

    if (
      Array.isArray(object.portfolios)
    ) {
      return object.portfolios.map(
        normalizePortfolio,
      );
    }

    if (
      Array.isArray(object.results)
    ) {
      return object.results.map(
        normalizePortfolio,
      );
    }

    if (
      Array.isArray(object.data)
    ) {
      return object.data.map(
        normalizePortfolio,
      );
    }
  }

  return [];
}

async function request(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const token = getToken();

  const headers = new Headers(
    init.headers,
  );

  headers.set(
    "Authorization",
    `Bearer ${token}`,
  );

  headers.set(
    "Accept",
    "application/json",
  );

  if (
    init.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...init,
      headers,
    },
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        `خطا در درخواست: ${response.status}`,
      ),
    );
  }

  return data;
}

/**
 * دریافت پرتفولیوهای فعال
 *
 * GET /app/portfolio/
 */
export async function getPortfolios(): Promise<
  Portfolio[]
> {
  const data = await request(
    "/app/portfolio/",
    {
      method: "GET",
    },
  );

  return extractPortfolioList(data);
}

/**
 * دریافت پرتفولیوهای آرشیو شده
 *
 * GET /app/portfolio/archive/
 */
export async function getArchivedPortfolios(): Promise<
  Portfolio[]
> {
  const data = await request(
    "/app/portfolio/archive/",
    {
      method: "GET",
    },
  );

  return extractPortfolioList(data);
}

/**
 * فعال کردن پرتفولیو
 *
 * GET /app/portfolio/active/{id}/
 */
export async function activatePortfolio(
  id: string | number,
): Promise<void> {
  await request(
    `/app/portfolio/active/${encodeURIComponent(
      String(id),
    )}/`,
    {
      method: "GET",
    },
  );
}

/**
 * ساخت پرتفولیو
 *
 * POST /app/portfolio/add/
 */
export async function createPortfolio(
  input: CreatePortfolioInput,
): Promise<Portfolio | null> {
  const data = await request(
    "/app/portfolio/add/",
    {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        broker: input.broker,
        balance: String(
          input.balance,
        ),
        currency: input.currency,
        leverage: input.leverage,
      }),
    },
  );

  if (
    typeof data === "object" &&
    data !== null &&
    "portfolio" in data
  ) {
    const portfolio = (
      data as {
        portfolio?: unknown;
      }
    ).portfolio;

    if (portfolio) {
      return normalizePortfolio(
        portfolio,
      );
    }
  }

  return null;
}

/**
 * ویرایش پرتفولیو
 *
 * PUT /app/portfolio/edit/{id}/
 */
export async function updatePortfolio(
  id: string | number,
  input: UpdatePortfolioInput,
): Promise<Portfolio | null> {
  const data = await request(
    `/app/portfolio/edit/${encodeURIComponent(
      String(id),
    )}/`,
    {
      method: "PUT",
      body: JSON.stringify({
        name: input.name,
        broker: input.broker,
        balance: String(
          input.balance,
        ),
        currency: input.currency,
        leverage: input.leverage,
      }),
    },
  );

  if (
    typeof data === "object" &&
    data !== null &&
    "portfolio" in data
  ) {
    const portfolio = (
      data as {
        portfolio?: unknown;
      }
    ).portfolio;

    if (portfolio) {
      return normalizePortfolio(
        portfolio,
      );
    }
  }

  return null;
}

/**
 * آرشیو پرتفولیو
 *
 * PATCH /app/portfolio/archive/{id}/
 */
export async function archivePortfolio(
  id: string | number,
): Promise<void> {
  await request(
    `/app/portfolio/archive/${encodeURIComponent(
      String(id),
    )}/`,
    {
      method: "PATCH",
    },
  );
}

/**
 * بازیابی پرتفولیو از آرشیو
 *
 * PATCH /app/portfolio/archive-out/{id}/
 */
export async function restorePortfolio(
  id: string | number,
): Promise<void> {
  await request(
    `/app/portfolio/archive-out/${encodeURIComponent(
      String(id),
    )}/`,
    {
      method: "PATCH",
    },
  );
}

/**
 * نام جایگزین برای بازیابی
 */
export const unarchivePortfolio =
  restorePortfolio;

/**
 * حذف دائمی پرتفولیو
 *
 * DELETE /app/portfolio/delete/{id}/
 */
export async function deletePortfolio(
  id: string | number,
): Promise<void> {
  await request(
    `/app/portfolio/delete/${encodeURIComponent(
      String(id),
    )}/`,
    {
      method: "DELETE",
    },
  );
}

