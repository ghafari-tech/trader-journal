
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  CreditCard,
  Cpu,
  Activity,
  Plus,
  MoreVertical,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { apiFetch } from "@/api/client";

export const Route = createFileRoute("/app/admin")({
  head: () => ({
    meta: [{ title: "پنل مدیریت" }],
  }),
  component: AdminPage,
});

type AdminUser = {
  id?: number | string;
  user_id?: number | string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  plan?: string;
  status?: string;
  joined?: string;
  date_joined?: string;
  created_at?: string;
  is_active?: boolean;
};

type AdminUsersResponse =
  | AdminUser[]
  | {
      users?: AdminUser[];
      data?: AdminUser[];
      results?: AdminUser[];
    };

const kpis = [
  {
    label: "کل کاربران",
    value: "—",
    change: "",
    icon: Users,
  },
  {
    label: "اشتراک‌های فعال",
    value: "—",
    change: "",
    icon: CreditCard,
  },
  {
    label: "درآمد ماهانه",
    value: "—",
    change: "",
    icon: TrendingUp,
  },
  {
    label: "API Calls",
    value: "—",
    change: "",
    icon: Cpu,
  },
];

function getUsersFromResponse(
  payload: AdminUsersResponse,
): AdminUser[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.users)) {
    return payload.users;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
}

function getUserName(user: AdminUser): string {
  if (user.name?.trim()) {
    return user.name.trim();
  }

  const fullName =
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

  return fullName || "کاربر";
}

function getUserStatus(user: AdminUser): {
  label: string;
  className: string;
} {
  /*
   * اگر API مقدار is_active داشته باشد،
   * این مقدار اولویت دارد.
   */
  if (typeof user.is_active === "boolean") {
    if (user.is_active) {
      return {
        label: "فعال",
        className:
          "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
      };
    }

    return {
      label: "غیرفعال",
      className:
        "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
    };
  }

  /*
   * اگر API به‌جای is_active از status استفاده کند،
   * مقدار status را بررسی می‌کنیم.
   */
  const rawStatus =
    user.status?.trim().toLowerCase() ?? "";

  if (
    rawStatus === "active" ||
    rawStatus === "فعال"
  ) {
    return {
      label: "فعال",
      className:
        "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
    };
  }

  if (
    rawStatus === "inactive" ||
    rawStatus === "غیرفعال"
  ) {
    return {
      label: "غیرفعال",
      className:
        "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
    };
  }

  /*
   * اگر API وضعیت دیگری فرستاد،
   * همان مقدار را نمایش می‌دهیم ولی
   * به‌صورت پیش‌فرض قرمز در نظر می‌گیریم
   * تا وضعیت ناشناخته اشتباهاً فعال نمایش داده نشود.
   */
  if (rawStatus) {
    return {
      label: user.status!,
      className:
        "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
    };
  }

  /*
   * اگر هیچ status یا is_active وجود نداشت،
   * فعلاً غیرفعال در نظر می‌گیریم.
   */
  return {
    label: "غیرفعال",
    className:
      "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
  };
}

function getUserPlan(user: AdminUser): string {
  return user.plan || "رایگان";
}

function getUserDate(user: AdminUser): string {
  return (
    user.joined ||
    user.date_joined ||
    user.created_at ||
    "—"
  );
}

function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      setUsersError("");

      const response =
        await apiFetch<AdminUsersResponse>(
          "/app/admin/users/",
          {
            method: "GET",
          },
          {
            auth: true,
          },
        );

      const userList =
        getUsersFromResponse(response);

      setUsers(userList);
    } catch (error) {
      console.error(
        "Admin users error:",
        error,
      );

      setUsersError(
        error instanceof Error
          ? error.message
          : "دریافت لیست کاربران ناموفق بود",
      );
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  return (
    <AppShell
      title="پنل مدیریت"
      subtitle="مدیریت کاربران، اشتراک‌ها، APIها و تنظیمات سیستم"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="card-surface p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {k.label}
              </span>

              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 text-2xl font-bold tabular">
              {k.label === "کل کاربران"
                ? users.length.toLocaleString("fa-IR")
                : k.value}
            </div>

            {k.change && (
              <div className="mt-1 text-xs gain tabular">
                {k.change} این ماه
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Tabs
          defaultValue="users"
          dir="rtl"
        >
          <TabsList>
            <TabsTrigger value="users">
              کاربران
            </TabsTrigger>

            <TabsTrigger value="payments">
              پرداخت‌ها
            </TabsTrigger>

            <TabsTrigger value="plans">
              پلن‌ها
            </TabsTrigger>

            <TabsTrigger value="apis">
              API هوش مصنوعی
            </TabsTrigger>

            <TabsTrigger value="logs">
              لاگ‌ها
            </TabsTrigger>
          </TabsList>

          {/* کاربران */}
          <TabsContent
            value="users"
            className="mt-4"
          >
            <div className="card-surface p-5">
              {loadingUsers ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال دریافت کاربران...
                </div>
              ) : usersError ? (
                <div className="flex min-h-40 flex-col items-center justify-center gap-3">
                  <p className="text-sm text-destructive">
                    {usersError}
                  </p>

                  <Button
                    variant="outline"
                    onClick={loadUsers}
                  >
                    تلاش مجدد
                  </Button>
                </div>
              ) : users.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                  هیچ کاربری پیدا نشد.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="py-3 text-right">
                          کاربر
                        </th>

                        <th className="py-3 text-right">
                          ایمیل
                        </th>

                        <th className="py-3 text-right">
                          پلن
                        </th>

                        <th className="py-3 text-right">
                          وضعیت
                        </th>

                        <th className="py-3 text-right">
                          تاریخ عضویت
                        </th>

                        <th className="py-3"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user, index) => {
                        const name =
                          getUserName(user);

                        const status =
                          getUserStatus(user);

                        const plan =
                          getUserPlan(user);

                        const date =
                          getUserDate(user);

                        const id =
                          user.id ??
                          user.user_id ??
                          index;

                        return (
                          <tr
                            key={String(id)}
                            className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
                          >
                            <td className="py-3 font-medium">
                              {name}
                            </td>

                            <td className="py-3 text-muted-foreground">
                              {user.email || "—"}
                            </td>

                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={
                                  plan === "Pro Max"
                                    ? "border-primary/40 bg-primary/10 text-primary"
                                    : ""
                                }
                              >
                                {plan}
                              </Badge>
                            </td>

                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={status.className}
                              >
                                {status.label}
                              </Badge>
                            </td>

                            <td className="py-3 text-xs text-muted-foreground tabular">
                              {date}
                            </td>

                            <td className="py-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* پرداخت‌ها */}
          <TabsContent
            value="payments"
            className="mt-4"
          >
            <div className="card-surface p-5">
              <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                اطلاعات پرداخت‌ها هنوز به API متصل نشده است.
              </div>
            </div>
          </TabsContent>

          {/* پلن‌ها */}
          <TabsContent
            value="plans"
            className="mt-4"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  n: "رایگان",
                  p: "۰ تومان",
                },
                {
                  n: "Pro",
                  p: "۱,۰۰۰,۰۰۰ تومان",
                },
                {
                  n: "Pro Max",
                  p: "۲,۰۰۰,۰۰۰ تومان",
                },
              ].map((plan) => (
                <div
                  key={plan.n}
                  className="card-surface p-5"
                >
                  <div className="font-semibold">
                    {plan.n}
                  </div>

                  <div className="mt-2 text-2xl font-bold tabular">
                    {plan.p}
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    اطلاعات کاربران این پلن هنوز از API
                    دریافت نمی‌شود.
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    ویرایش پلن
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* API */}
          <TabsContent
            value="apis"
            className="mt-4"
          >
            <div className="card-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  APIهای فعال
                </h3>

                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="ml-1 h-4 w-4" />
                  افزودن API
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  {
                    n: "OpenAI GPT-5",
                    key: "sk-...xY42",
                    usage: 68,
                    def: true,
                  },
                  {
                    n: "Google Gemini Pro",
                    key: "AIza...9k",
                    usage: 42,
                    def: false,
                  },
                ].map((api) => (
                  <div
                    key={api.n}
                    className="flex items-center gap-4 rounded-lg border border-border bg-secondary/40 p-4"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Cpu className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {api.n}
                        </span>

                        {api.def && (
                          <Badge className="bg-primary text-primary-foreground">
                            پیش‌فرض
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground tabular">
                        کلید: {api.key}
                      </div>
                    </div>

                    <div className="text-sm tabular">
                      {api.usage.toLocaleString()}K درخواست
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* لاگ‌ها */}
          <TabsContent
            value="logs"
            className="mt-4"
          >
            <div className="card-surface p-5">
              <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                لاگ‌ها هنوز به API متصل نشده‌اند.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
