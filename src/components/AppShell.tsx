
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  BookOpen,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Target,
  Trophy,
  Settings,
  UserCog,
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  ChevronDown,
  Loader2,
  Circle,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { apiFetch } from "@/api/client";
import { logout } from "@/api/auth";

import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from "@/api/notification";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

/* =========================================================
   Navigation
========================================================= */

const nav = [
  {
    to: "/app/dashboard",
    icon: LayoutDashboard,
    label: "داشبورد",
  },
  {
    to: "/app/portfolios",
    icon: Wallet,
    label: "پرتفولیوها",
  },
  {
    to: "/app/trades",
    icon: LineChart,
    label: "معاملات",
  },
  {
    to: "/app/journal",
    icon: BookOpen,
    label: "ژورنال",
  },
  {
    to: "/app/ai-coach",
    icon: Sparkles,
    label: "مربی هوشمند",
  },
  {
    to: "/app/calendar",
    icon: CalendarDays,
    label: "تقویم معاملاتی",
  },
  {
    to: "/app/risk",
    icon: ShieldCheck,
    label: "مدیریت ریسک",
  },
  {
    to: "/app/goals",
    icon: Target,
    label: "اهداف",
  },
  {
    to: "/app/achievements",
    icon: Trophy,
    label: "نشان‌ها",
  },
  {
    to: "/app/settings",
    icon: Settings,
    label: "تنظیمات",
  },
  {
    to: "/app/admin",
    icon: UserCog,
    label: "پنل مدیریت",
  },
] as const;

/* =========================================================
   API Types
========================================================= */

type UserApiResponse = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  image_profile?: string | null;
};

type PlanApiResponse = {
  plan?: {
    id?: number;
    user?: number;
    type?: number;
    type_name?: string | null;
    type_display?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  } | null;
};

/* =========================================================
   Helpers
========================================================= */

function toPersianNumber(
  value: string | number,
): string {
  return String(value).replace(/\d/g, (digit) => {
    return "۰۱۲۳۴۵۶۷۸۹"[Number(digit)];
  });
}

function formatDate(
  dateString?: string | null,
): string {
  if (!dateString) {
    return "—";
  }

  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  const [year, month, day] = parts;

  return toPersianNumber(
    `${year}/${month}/${day}`,
  );
}

function calculateRemainingDays(
  endDate?: string | null,
): number | null {
  if (!endDate) {
    return null;
  }

  const normalizedDate = endDate.includes("T")
    ? endDate
    : `${endDate}T23:59:59`;

  const end = new Date(normalizedDate);

  if (Number.isNaN(end.getTime())) {
    return null;
  }

  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.ceil(
    diff / (1000 * 60 * 60 * 24),
  );
}

/**
 * تبدیل زمان اعلان به متن فارسی
 */
function formatNotificationTime(
  dateString?: string | null,
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(
    diffMs / (1000 * 60),
  );

  if (diffMinutes < 1) {
    return "همین الان";
  }

  if (diffMinutes < 60) {
    return `${toPersianNumber(diffMinutes)} دقیقه پیش`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${toPersianNumber(diffHours)} ساعت پیش`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${toPersianNumber(diffDays)} روز پیش`;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/* =========================================================
   Notification Icon
========================================================= */

function NotificationIcon({
  notification,
}: {
  notification: Notification;
}) {
  const icon = String(notification.icon ?? "")
    .trim()
    .toLowerCase();

  if (
    icon.includes("warning") ||
    icon.includes("alert") ||
    icon.includes("risk")
  ) {
    return <span className="text-lg">⚠️</span>;
  }

  if (
    icon.includes("success") ||
    icon.includes("check")
  ) {
    return <span className="text-lg">✅</span>;
  }

  if (
    icon.includes("trophy") ||
    icon.includes("achievement")
  ) {
    return <span className="text-lg">🏆</span>;
  }

  if (
    icon.includes("journal") ||
    icon.includes("book")
  ) {
    return <BookOpen className="h-4 w-4" />;
  }

  return <Bell className="h-4 w-4" />;
}

/* =========================================================
   User Block
========================================================= */

function UserBlock({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [user, setUser] =
    useState<UserApiResponse | null>(null);

  const [plan, setPlan] =
    useState<PlanApiResponse["plan"]>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /**
   * دریافت اطلاعات کاربر و اشتراک به‌صورت مستقل.
   *
   * خطای API اشتراک نباید باعث از دست رفتن
   * اطلاعات نام و ایمیل کاربر شود.
   */
  async function loadUserData() {
    setLoading(true);
    setError(false);

    try {
      const userResult = await apiFetch<UserApiResponse>(
        "/app/settings/user-info/",
        {
          method: "GET",
        },
      );

      setUser(userResult);
    } catch (err) {
      console.error("Load user error:", err);
      setError(true);
    }

    try {
      const planResult = await apiFetch<PlanApiResponse>(
        "/app/settings/plan/",
        {
          method: "GET",
        },
      );

      setPlan(planResult?.plan ?? null);
    } catch (err) {
      console.error("Load plan error:", err);
      setPlan(null);
    }

    setLoading(false);
  }

  /**
   * خروج از حساب
   */
  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      await logout();

      toast.success("با موفقیت از حساب خارج شدید");

      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);

      toast.error("در حال خروج از حساب...");

      window.location.href = "/";
    } finally {
      setLoggingOut(false);
    }
  }

  /**
   * به‌روزرسانی اطلاعات در شرایط زیر:
   * - ورود یا تغییر اطلاعات کاربر
   * - تغییر اشتراک
   * - بازگشت به صفحه پس از پرداخت
   * - بازگشت به تب مرورگر
   */
  useEffect(() => {
    let mounted = true;

    const refreshUserData = () => {
      if (mounted) {
        void loadUserData();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUserData();
      }
    };

    void loadUserData();

    window.addEventListener(
      "traderjournal-user-changed",
      refreshUserData,
    );

    window.addEventListener(
      "traderjournal-plan-changed",
      refreshUserData,
    );

    window.addEventListener(
      "storage",
      refreshUserData,
    );

    window.addEventListener(
      "pageshow",
      refreshUserData,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "traderjournal-user-changed",
        refreshUserData,
      );

      window.removeEventListener(
        "traderjournal-plan-changed",
        refreshUserData,
      );

      window.removeEventListener(
        "storage",
        refreshUserData,
      );

      window.removeEventListener(
        "pageshow",
        refreshUserData,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  /* =======================================================
     Display Name
  ======================================================= */

  const firstName = user?.first_name?.trim() || "";
  const lastName = user?.last_name?.trim() || "";

  const fullName =
    `${firstName} ${lastName}`.trim() || "کاربر";

  const nameParts = fullName
    .split(/\s+/)
    .filter(Boolean);

  const displayFirstName = nameParts[0] || "";
  const displayLastName = nameParts.slice(1).join(" ");

  const initials =
    displayLastName.length > 0
      ? `${displayFirstName.charAt(0)}${displayLastName.charAt(0)}`
      : displayFirstName.charAt(0) || "ک";

  /* =======================================================
     Plan
  ======================================================= */

  /**
   * نام پلن در API ممکن است با یکی از این دو فیلد
   * برگردد: type_name یا type_display.
   */
  const planName =
    plan?.type_name?.trim() ||
    plan?.type_display?.trim() ||
    "بدون اشتراک";

  const remainingDays = calculateRemainingDays(
    plan?.end_date,
  );

  const isPlanActive =
    plan !== null &&
    remainingDays !== null &&
    remainingDays > 0;

  /* =======================================================
     Loading State
  ======================================================= */

  if (loading) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5",
          compact && "border-0 bg-transparent p-1.5",
        )}
      >
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/20 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-12 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  /* =======================================================
     Error State
  ======================================================= */

  if (error) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5 text-right transition-colors hover:bg-sidebar-accent/70",
              compact &&
                "border-0 bg-transparent p-1.5 hover:bg-sidebar-accent/40",
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-destructive/10 text-destructive">
                !
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                کاربر
              </div>

              <div className="text-[10px] text-destructive">
                خطا در دریافت اطلاعات
              </div>
            </div>

            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>
            اطلاعات کاربر
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              void loadUserData();
            }}
          >
            تلاش مجدد
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/app/settings" className="cursor-pointer">
              <Settings className="ml-2 h-4 w-4" />
              تنظیمات پروفایل
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  /* =======================================================
     Main User UI
  ======================================================= */

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5 text-right transition-colors hover:bg-sidebar-accent/70",
            compact &&
              "border-0 bg-transparent p-1.5 hover:bg-sidebar-accent/40",
          )}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {fullName}
            </div>

            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={cn(
                  "h-4 px-1.5 text-[10px]",
                  isPlanActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                {planName}
              </Badge>
            </div>
          </div>

          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">
              {fullName}
            </span>

            {user?.email && (
              <span className="truncate text-[11px] font-normal text-muted-foreground">
                {user.email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                اشتراک فعلی
              </span>

              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  isPlanActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                {planName}
              </Badge>
            </div>

            {plan ? (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground">
                      شروع اشتراک
                    </div>

                    <div className="mt-1 text-xs font-medium">
                      {formatDate(plan.start_date)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground">
                      پایان اشتراک
                    </div>

                    <div className="mt-1 text-xs font-medium">
                      {formatDate(plan.end_date)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t border-border pt-2">
                  {isPlanActive ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        زمان باقی‌مانده
                      </span>

                      <span className="text-xs font-semibold text-primary">
                        {toPersianNumber(remainingDays ?? 0)} روز
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-destructive">
                      {remainingDays === 0
                        ? "اشتراک منقضی شده است"
                        : "وضعیت اشتراک قابل تأیید نیست"}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-2 text-xs text-muted-foreground">
                اطلاعات اشتراک دریافت نشد یا اشتراکی برای حساب شما ثبت نشده است.
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/app/settings" className="cursor-pointer">
            <Settings className="ml-2 h-4 w-4" />
            تنظیمات پروفایل
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/app/portfolios" className="cursor-pointer">
            <Wallet className="ml-2 h-4 w-4" />
            پرتفولیوها
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={loggingOut}
          className="cursor-pointer text-destructive focus:text-destructive"
          onSelect={() => {
            void handleLogout();
          }}
        >
          {loggingOut ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="ml-2 h-4 w-4" />
          )}

          {loggingOut ? "در حال خروج..." : "خروج از حساب"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   Navigation List
========================================================= */

function NavList({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const location = useLocation();

  return (
    <ul className="space-y-1">
      {nav.map((item) => {
        const active = location.pathname === item.to;
        const Icon = item.icon;

        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active && "text-primary",
                )}
              />

              <span className="truncate">
                {item.label}
              </span>

              {active && (
                <span className="mr-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* =========================================================
   Notifications
========================================================= */

function NotificationsMenu() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function loadNotifications() {
    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(
        Array.isArray(data) ? data : [],
      );
    } catch (err) {
      console.error("Get notifications error:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * خوانده‌شده کردن اعلان
   */
  async function handleNotificationClick(
    notification: Notification,
  ) {
    if (notification.is_read) {
      return;
    }

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item,
        ),
      );
    } catch (err) {
      console.error("Mark notification as read error:", err);
      toast.error("علامت‌گذاری اعلان انجام نشد.");
    }
  }

  useEffect(() => {
    void loadNotifications();
  }, []);

  const activeNotifications = notifications.filter(
    (notification) => notification.is_active !== false,
  );

  const unreadCount = activeNotifications.filter(
    (notification) => notification.is_read === false,
  ).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 border-border bg-secondary/60"
        >
          <Bell className="h-4 w-4" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
              {toPersianNumber(unreadCount)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>اعلان‌ها</span>

          {unreadCount > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {toPersianNumber(unreadCount)} خوانده‌نشده
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال دریافت اعلان‌ها...
          </div>
        ) : activeNotifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            اعلان جدیدی وجود ندارد.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {activeNotifications.map((notification) => {
              const isUnread = notification.is_read === false;

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "cursor-pointer items-start gap-3 py-3",
                    isUnread && "bg-primary/5",
                  )}
                  onSelect={() => {
                    void handleNotificationClick(notification);
                  }}
                >
                  <div
                    className={cn(
                      "relative mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                      isUnread
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    <NotificationIcon notification={notification} />

                    {isUnread && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "truncate text-sm",
                        isUnread
                          ? "font-bold text-foreground"
                          : "font-medium",
                      )}
                    >
                      {notification.title}
                    </div>

                    <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {notification.body}
                    </div>

                    <div className="mt-1 text-[10px] text-muted-foreground/70">
                      {formatNotificationTime(notification.created_at)}
                    </div>
                  </div>

                  {isUnread && (
                    <Circle className="mt-1 h-2 w-2 shrink-0 fill-primary text-primary" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* =========================================================
   AppShell
========================================================= */

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-l border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
              <LineChart className="h-5 w-5" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">
                TraderJournal
              </span>

              <span className="text-[10px] text-muted-foreground">
                AI Coach
              </span>
            </div>
          </div>

          {/* User */}
          <div className="border-b border-sidebar-border p-3">
            <UserBlock />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              منو
            </div>

            <NavList />
          </nav>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
            {/* Mobile menu */}
            <Sheet
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-border bg-secondary/60 lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-72 border-l border-sidebar-border bg-sidebar p-0"
              >
                <SheetTitle className="sr-only">
                  منوی اصلی
                </SheetTitle>

                {/* Mobile Logo */}
                <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
                    <LineChart className="h-5 w-5" />
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold">
                      TraderJournal
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      AI Coach
                    </span>
                  </div>
                </div>

                {/* Mobile User */}
                <div className="border-b border-sidebar-border p-3">
                  <UserBlock />
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                  <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    منو
                  </div>

                  <NavList
                    onNavigate={() => setMobileOpen(false)}
                  />
                </nav>
              </SheetContent>
            </Sheet>

            {/* Search + Actions */}
            <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
              {/* Search */}
              <div className="relative min-w-0 max-w-md flex-1">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="جستجو در معاملات، ژورنال..."
                  className="h-10 border-border bg-secondary/60 pr-9 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <NotificationsMenu />

                <Link
                  to="/app/trades/new"
                  className="hidden sm:block"
                >
                  <Button
                    size="sm"
                    className="h-10 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    معامله جدید
                  </Button>
                </Link>

                <Link
                  to="/app/trades/new"
                  className="sm:hidden"
                >
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Page Header */}
          <div className="border-b border-border bg-background/40 px-4 py-6 md:px-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight">
                  {title}
                </h1>

                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>

              {actions && (
                <div className="shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
