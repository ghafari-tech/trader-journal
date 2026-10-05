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

function getUserStatus(user: AdminUser): { label: string; className: string } {
  if (typeof user.is_active === "boolean") {
    if (user.is_active) {
      return {
        label: "فعال",
        className: "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
      };
    }
    return {
      label: "غیرفعال",
      className: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
    };
  }

  const rawStatus = user.status?.trim().toLowerCase() ?? "";

  if (rawStatus === "active" || rawStatus === "فعال") {
    return {
      label: "فعال",
      className: "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
    };
  }

  return {
    label: "غیرفعال",
    className: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
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

function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  // Subscriptions / Plans States
  const [plans, setPlans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  // Payments State
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Form State for Editing
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "" });

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      setUsersError("");
      const response = await apiFetch<AdminUsersResponse>(
        "/app/admin/users/",
        { method: "GET" },
        { auth: true }
      );
      if (response && Array.isArray(response.users)) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Admin users error:", error);
      setUsersError(
        error instanceof Error ? error.message : "دریافت لیست کاربران ناموفق بود"
      );
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
        { auth: true }
      );
      if (response && Array.isArray(response.subscriptions)) {
        setPlans(response.subscriptions);
      }
    } catch (error) {
      console.warn("Could not fetch subscriptions, using fallback:", error);
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
        { auth: true }
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

  useEffect(() => {
    void loadUsers();
    void loadPlans();
    void loadPayments();
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

      // استخراج عدد قیمت ناخالص
      const cleanPrice = Number(editForm.price.toString().replace(/[^\d]/g, "")) || 0;

      // ساخت بدنه دقیق مطابق با Swagger
      const payload = {
        name: editForm.name,
        price: cleanPrice,
        features: selectedPlan.features
          ? selectedPlan.features.map((f) => ({ value: f.value }))
          : [],
      };

      // ارسال درخواست PATCH به آدرس دقیق Swagger
      await apiFetch<SubscriptionPlan>(
        `/app/admin/subscriptions/update/${selectedPlan.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
        { auth: true }
      );

      // همگام‌سازی مجدد لیست پلن‌ها
      await loadPlans();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update subscription:", error);
      alert("خطا در ذخیره‌سازی تغییرات.");
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <AppShell
      title="پنل مدیریت"
      subtitle="مدیریت کاربران، اشتراک‌ها، APIها و تنظیمات سیستم"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.label}</span>
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
              <div className="mt-1 text-xs gain tabular">{k.change} این ماه</div>
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
                  <p className="text-sm text-destructive">{usersError}</p>
                  <Button variant="outline" onClick={loadUsers}>
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
                        <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 tabular">#{p.id}</td>
                          <td className="py-3">{p.user || "—"}</td>
                          <td className="py-3 tabular">{p.amount ?? "—"}</td>
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
                  <div key={plan.id} className="card-surface p-5 flex flex-col justify-between">
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

          {/* API */}
          <TabsContent value="apis" className="mt-4">
            <div className="card-surface p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">APIهای فعال</h3>
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
                        <span className="font-medium">{api.n}</span>
                        {api.def && (
                          <Badge className="bg-primary text-primary-foreground">
                            پیش‌‌فرض
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

                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent dir="rtl" className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ویرایش پلن {selectedPlan?.name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="plan-name">نام پلن</Label>
              <Input
                id="plan-name"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan-price">قیمت (تومان)</Label>
              <Input
                id="plan-price"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSavePlan} disabled={savingPlan}>
              {savingPlan && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}