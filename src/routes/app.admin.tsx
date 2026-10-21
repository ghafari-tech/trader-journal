
// 


import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  CreditCard,
  Cpu,
  Plus,
  MoreVertical,
  TrendingUp,
  Loader2,
  Pencil,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  subscription_type?: string;
  plan?: string;
  status?: string;
  joined?: string;
  date_joined?: string;
  created_at?: string;
  is_active?: boolean;
};

type AdminUsersResponse = {
  users?: AdminUser[];
};

type PlanFeature = {
  id?: number;
  value: string;
};

type SubscriptionPlan = {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  features?: PlanFeature[];
};

type SubscriptionsResponse = {
  subscriptions?: SubscriptionPlan[];
};

type PaymentItem = {
  id: number | string;
  user?: string;
  amount?: string | number;
  status?: string;
  created_at?: string;
};

type AiModel = {
  id: number;
  name: string;
  model: string;
  description?: string;
  api_key?: string;
  url?: string;
  is_default: boolean;
  used_tokens: number;
  request_count: number;
};

type AdminDashboardResponse = {
  users_count?: number;
  subscriptions_count?: number;
  income_monthly?: number | string;
  api_calls?: number;
};

type AiModelsResponse = {
  ai_models: AiModel[];
};

const DEFAULT_PLANS: SubscriptionPlan[] = [
  { id: 2, name: "Pro", price: 0, description: "ویژه معامله‌‌گران حرفه‌ای" },
  { id: 3, name: "Pro Max", price: 0, description: "دسترسی کامل به تمام ابزارها" },
  { id: 4, name: "Pro Max", price: 2000000, description: "دسترسی پیشرفته و AI" },
];

const kpis = [
  { label: "کل کاربران", value: "—", change: "", icon: Users },
  { label: "اشتراک‌های فعال", value: "—", change: "", icon: CreditCard },
  { label: "درآمد ماهانه", value: "—", change: "", icon: TrendingUp },
  { label: "API Calls", value: "—", change: "", icon: Cpu },
];

function getUserName(user: AdminUser): string {
  if (user.name?.trim()) return user.name.trim();
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return fullName || "کاربر";
}

function getUserStatus(
  user: AdminUser,
): { label: string; className: string } {
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

  const rawStatus = user.status?.trim().toLowerCase() ?? "";

  if (rawStatus === "active" || rawStatus === "فعال") {
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

function getUserPlan(user: AdminUser): string {
  return user.subscription_type || user.plan || "رایگان";
}

function getUserDate(user: AdminUser): string {
  const rawDate = user.created_at || user.joined || user.date_joined;
  if (!rawDate) return "—";
  return rawDate.split("T")[0];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "دریافت اطلاعات از سرور ناموفق بود.";
}

function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const [aiModels, setAiModels] = useState<AiModel[]>([]);
  const [loadingAiModels, setLoadingAiModels] = useState(true);
  const [aiModelsError, setAiModelsError] = useState("");
  const [apiCalls, setApiCalls] = useState<number | null>(null);
  const [loadingAdminStats, setLoadingAdminStats] = useState(true);
  const [adminStatsError, setAdminStatsError] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [accessState, setAccessState] = useState<
    "checking" | "allowed" | "denied"
  >("checking");

  async function loadUsers(): Promise<boolean> {
    try {
      setLoadingUsers(true);
      setUsersError("");

      const response = await apiFetch<AdminUsersResponse>(
        "/app/admin/users/",
        { method: "GET" },
        { auth: true },
      );

      if (!response || !Array.isArray(response.users)) {
        throw new Error("ساختار پاسخ کاربران معتبر نیست.");
      }

      setUsers(response.users);
      return true;
    } catch (error) {
      console.error("Admin users error:", error);
      setUsersError(getErrorMessage(error));
      return false;
    } finally {
      setLoadingUsers(false);
    }
  }

  async function loadPlans() {
    try {
      setLoadingPlans(true);

      const response = await apiFetch<SubscriptionsResponse>(
        "/app/admin/subscriptions/",
        { method: "GET" },
        { auth: true },
      );

      if (response && Array.isArray(response.subscriptions)) {
        setPlans(response.subscriptions);
      }
    } catch (error) {
      console.warn("Could not fetch subscriptions:", error);
    } finally {
      setLoadingPlans(false);
    }
  }

  async function loadPayments() {
    try {
      setLoadingPayments(true);

      const response = await apiFetch<PaymentItem[]>(
        "/app/admin/pays/",
        { method: "GET" },
        { auth: true },
      );

      if (Array.isArray(response)) {
        setPayments(response);
      }
    } catch (error) {
      console.warn("Could not fetch payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  }

  async function loadAdminStats() {
    try {
      setLoadingAdminStats(true);
      setAdminStatsError("");

      const response = await apiFetch<AdminDashboardResponse>(
        "/app/admin/",
        { method: "GET" },
        { auth: true },
      );

      if (!response || typeof response.api_calls !== "number") {
        throw new Error("ساختار پاسخ آمار پنل مدیریت معتبر نیست.");
      }

      setApiCalls(response.api_calls);
    } catch (error) {
      console.error("Admin dashboard stats error:", error);
      setApiCalls(null);
      setAdminStatsError(getErrorMessage(error));
    } finally {
      setLoadingAdminStats(false);
    }
  }

  async function loadAiModels() {
    try {
      setLoadingAiModels(true);
      setAiModelsError("");

      const response = await apiFetch<AiModelsResponse>(
        "/app/admin/ai-models/",
        { method: "GET" },
        { auth: true },
      );

      if (!response || !Array.isArray(response.ai_models)) {
        throw new Error(
          "ساختار پاسخ مدل‌های هوش مصنوعی معتبر نیست.",
        );
      }

      setAiModels(response.ai_models);
    } catch (error) {
      console.error("Admin AI models error:", error);
      setAiModels([]);
      setAiModelsError(getErrorMessage(error));
    } finally {
      setLoadingAiModels(false);
    }
  }

  async function checkAdminAccess() {
    setAccessState("checking");

    const allowed = await loadUsers();

    if (!allowed) {
      setAccessState("denied");
      return;
    }

    setAccessState("allowed");

    await Promise.all([
      loadPlans(),
      loadPayments(),
      loadAiModels(),
      loadAdminStats(),
    ]);
  }

  useEffect(() => {
    void checkAdminAccess();
  }, []);

  const handleOpenEditModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setEditForm({
      name: plan.name,
      price: String(plan.price),
      description: plan.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSavePlan = async () => {
    if (!selectedPlan) return;

    try {
      setSavingPlan(true);

      const cleanPrice =
        Number(editForm.price.toString().replace(/[^\d]/g, "")) || 0;

      const payload = {
        name: editForm.name,
        price: cleanPrice,
        features: selectedPlan.features
          ? selectedPlan.features.map((feature) => ({
              value: feature.value,
            }))
          : [],
      };

      await apiFetch<SubscriptionPlan>(
        `/app/admin/subscriptions/update/${selectedPlan.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        { auth: true },
      );

      await loadPlans();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update subscription:", error);
      alert("خطا در ذخیره‌سازی تغییرات.");
    } finally {
      setSavingPlan(false);
    }
  };

  if (accessState === "checking") {
    return (
      <AppShell
        title="بررسی دسترسی"
        subtitle="در حال بررسی مجوز ورود به پنل مدیریت"
      >
        <div className="card-surface flex min-h-60 items-center justify-center gap-3 p-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            در حال بررسی دسترسی مدیریتی...
          </span>
        </div>
      </AppShell>
    );
  }

  if (accessState === "denied") {
    return (
      <AppShell
        title="دسترسی محدود"
        subtitle="پنل مدیریت"
      >
        <div className="card-surface flex min-h-60 flex-col items-center justify-center gap-4 p-6 text-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h2 className="text-lg font-semibold">
            امکان دسترسی به پنل مدیریت وجود ندارد
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            دسترسی مدیریتی تأیید نشد. اگر حساب شما ادمین است،
            اتصال سرور و مجوزهای حساب را بررسی کنید.
          </p>
          <Button onClick={() => void checkAdminAccess()}>
            تلاش مجدد
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="پنل مدیریت"
      subtitle="مدیریت کاربران، اشتراک‌ها، APIها و تنظیمات سیستم"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-surface p-5">
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
                : k.label === "API Calls"
                  ? loadingAdminStats
                    ? "…"
                    : apiCalls === null
                      ? "—"
                      : apiCalls.toLocaleString("fa-IR")
                  : k.value}
            </div>

            {k.label === "API Calls" && adminStatsError && (
              <div className="mt-1 text-xs text-destructive">
                دریافت آمار ناموفق بود
              </div>
            )}
            {k.change && (
              <div className="mt-1 text-xs gain tabular">
                {k.change} این ماه
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Tabs defaultValue="users" dir="rtl">
          <TabsList>
            <TabsTrigger value="users">کاربران</TabsTrigger>
            <TabsTrigger value="payments">پرداخت‌ها</TabsTrigger>
            <TabsTrigger value="plans">پلن‌ها</TabsTrigger>
            <TabsTrigger value="apis">API هوش مصنوعی</TabsTrigger>
          </TabsList>

          {/* کاربران */}
          <TabsContent value="users" className="mt-4">
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
                    onClick={() => void loadUsers()}
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
                        <th className="py-3 text-right">کاربر</th>
                        <th className="py-3 text-right">ایمیل</th>
                        <th className="py-3 text-right">پلن</th>
                        <th className="py-3 text-right">وضعیت</th>
                        <th className="py-3 text-right">تاریخ عضویت</th>
                        <th className="py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => {
                        const name = getUserName(user);
                        const status = getUserStatus(user);
                        const plan = getUserPlan(user);
                        const date = getUserDate(user);
                        const id = user.id ?? user.user_id ?? index;

                        return (
                          <tr
                            key={String(id)}
                            className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
                          >
                            <td className="py-3 font-medium">{name}</td>
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
          <TabsContent value="payments" className="mt-4">
            <div className="card-surface p-5">
              {loadingPayments ? (
                <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال دریافت اطلاعات پرداخت‌ها...
                </div>
              ) : payments.length === 0 ? (
                <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                  هیچ پرداختی ثبت نشده است.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="py-3 text-right">شناسه</th>
                        <th className="py-3 text-right">کاربر</th>
                        <th className="py-3 text-right">مبلغ</th>
                        <th className="py-3 text-right">وضعیت</th>
                        <th className="py-3 text-right">تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-border/50 hover:bg-secondary/30"
                        >
                          <td className="py-3 tabular">#{p.id}</td>
                          <td className="py-3">{p.user || "—"}</td>
                          <td className="py-3 tabular">
                            {p.amount ?? "—"}
                          </td>
                          <td className="py-3">{p.status || "—"}</td>
                          <td className="py-3 text-xs text-muted-foreground tabular">
                            {p.created_at || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* پلن‌ها */}
          <TabsContent value="plans" className="mt-4">
            {loadingPlans ? (
              <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                در حال دریافت پلن‌ها...
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="card-surface flex flex-col justify-between p-5"
                  >
                    <div>
                      <div className="font-semibold">{plan.name}</div>
                      <div className="mt-2 text-2xl font-bold tabular">
                        {plan.price.toLocaleString("fa-IR")} تومان
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        {plan.features && plan.features.length > 0
                          ? plan.features.map((f) => f.value).join(" - ")
                          : "بدون ویژگی ثبت‌شده"}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-6 w-full gap-2"
                      onClick={() => handleOpenEditModal(plan)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      ویرایش پلن
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* مدل‌های واقعی هوش مصنوعی */}
          <TabsContent value="apis" className="mt-4">
            <div className="card-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">APIهای هوش مصنوعی</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    اطلاعات مدل‌های ثبت‌شده در بک‌اند
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void loadAiModels()}
                  disabled={loadingAiModels}
                >
                  {loadingAiModels ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="ml-2 h-4 w-4" />
                  )}
                  به‌روزرسانی
                </Button>
              </div>

              {loadingAiModels ? (
                <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال دریافت مدل‌های هوش مصنوعی...
                </div>
              ) : aiModelsError ? (
                <div className="mt-5 rounded-lg border border-destructive/30 p-4">
                  <p className="text-sm text-destructive">
                    {aiModelsError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => void loadAiModels()}
                  >
                    تلاش مجدد
                  </Button>
                </div>
              ) : aiModels.length === 0 ? (
                <div className="mt-5 rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
                  هیچ مدلی در پاسخ سرور ثبت نشده است.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {aiModels.map((api) => (
                    <div
                      key={api.id}
                      className="rounded-lg border border-border bg-secondary/40 p-4"
                    >
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Cpu className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{api.name}</span>
                            {api.is_default && (
                              <Badge className="bg-primary text-primary-foreground">
                                پیش‌فرض
                              </Badge>
                            )}
                          </div>

                          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                            {api.model}
                          </p>

                          {api.description && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {api.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 border-t border-border/70 pt-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            شناسه مدل
                          </p>
                          <p className="mt-1 font-mono text-sm">
                            {api.id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            توکن مصرف‌شده
                          </p>
                          <p className="mt-1 text-sm font-semibold tabular">
                            {Number(api.used_tokens || 0).toLocaleString("fa-IR")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            تعداد درخواست‌های موفق
                          </p>
                          <p className="mt-1 text-sm font-semibold tabular">
                            {Number(api.request_count || 0).toLocaleString("fa-IR")}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground">
                            آدرس سرویس
                          </p>
                          <p className="mt-1 break-all font-mono text-xs">
                            {api.url || "ثبت نشده"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground">
                            وضعیت آمار
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            تعداد درخواست‌ها بر اساس درخواست‌های موفق ثبت‌شده در بک‌اند است.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ویرایش پلن */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent dir="rtl" className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              ویرایش پلن {selectedPlan?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="plan-name">نام پلن</Label>
              <Input
                id="plan-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan-price">قیمت (تومان)</Label>
              <Input
                id="plan-price"
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    price: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSavePlan}
              disabled={savingPlan}
            >
              {savingPlan && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
