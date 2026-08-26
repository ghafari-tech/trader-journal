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
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getCurrentUserFullName } from "@/lib/current-user";
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

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    tone: "loss",
    title: "نزدیک به سقف ریسک روزانه",
    desc: "به ۸۰٪ ریسک روزانه رسیدی.",
    time: "۵ دقیقه پیش",
  },
  {
    id: 2,
    icon: BookOpen,
    tone: "primary",
    title: "یادآور ژورنال",
    desc: "برای معامله T-1042 ژورنال ثبت نکردی.",
    time: "۱ ساعت پیش",
  },
  {
    id: 3,
    icon: Trophy,
    tone: "accent",
    title: "نشان جدید کسب کردی",
    desc: "«۷ روز پایبند به پلن» فعال شد.",
    time: "دیروز",
  },
  {
    id: 4,
    icon: CheckCircle2,
    tone: "primary",
    title: "گزارش هفتگی آماده است",
    desc: "مربی هوشمند گزارش هفتگی‌ات را ساخت.",
    time: "۲ روز پیش",
  },
];

function UserBlock({
  compact = false,
}: {
  compact?: boolean;
}) {
  /*
   * مهم:
   * اطلاعات کاربر ممکن است از localStorage بیاید.
   * بنابراین در اولین render مقدار ثابت می‌دهیم
   * تا SSR و Client دقیقاً یک خروجی داشته باشند.
   */
  const [userFullName, setUserFullName] =
    useState("کاربر");

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const fullName =
        getCurrentUserFullName();

      if (fullName?.trim()) {
        setUserFullName(
          fullName.trim(),
        );
      }
    } catch (error) {
      console.error(
        "Get current user error:",
        error,
      );
    }
  }, []);

  /*
   * قبل از hydration فقط مقدار ثابت
   * "کاربر" نمایش داده می‌شود.
   *
   * بعد از mount نام واقعی کاربر می‌آید.
   */
  const displayName = mounted
    ? userFullName
    : "کاربر";

  const nameParts = displayName
    .trim()
    .split(/\s+/);

  const firstName =
    nameParts[0] || "";

  const lastName =
    nameParts.slice(1).join(" ");

  const initials =
    lastName.length > 0
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`
      : firstName.charAt(0) || "ک";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
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
              {displayName}
            </div>

            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="h-4 border-primary/40 bg-primary/10 px-1.5 text-[10px] text-primary"
              >
                Pro Max
              </Badge>
            </div>
          </div>

          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56"
      >
        <DropdownMenuLabel>
          حساب کاربری
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            to="/app/settings"
            className="cursor-pointer"
          >
            <Settings className="ml-2 h-4 w-4" />
            تنظیمات پروفایل
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/app/portfolios"
            className="cursor-pointer"
          >
            <Wallet className="ml-2 h-4 w-4" />
            پرتفولیوها
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onSelect={() =>
            toast.success(
              "خارج شدی — به‌زودی به صفحه ورود برمی‌گردی",
            )
          }
        >
          <LogOut className="ml-2 h-4 w-4" />
          خروج از حساب
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavList({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const location = useLocation();

  return (
    <ul className="space-y-1">
      {nav.map((item) => {
        const active =
          location.pathname === item.to;

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
                  active &&
                    "text-primary",
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

function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 border-border bg-secondary/60"
        >
          <Bell className="h-4 w-4" />

          <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            {notifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>اعلان‌ها</span>

          <button
            onClick={() =>
              toast.success(
                "همه اعلان‌ها خوانده شد",
              )
            }
            className="text-[11px] text-primary hover:underline"
          >
            علامت‌گذاری همه
          </button>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon;

            return (
              <DropdownMenuItem
                key={n.id}
                className="cursor-pointer items-start gap-3 py-2.5"
              >
                <div
                  className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    n.tone ===
                      "loss" &&
                      "bg-destructive/15 text-destructive",
                    n.tone ===
                      "primary" &&
                      "bg-primary/15 text-primary",
                    n.tone ===
                      "accent" &&
                      "bg-accent/15 text-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {n.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {n.desc}
                  </div>

                  <div className="mt-1 text-[10px] text-muted-foreground/70">
                    {n.time}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-l border-sidebar-border bg-sidebar lg:flex lg:flex-col">
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

          <div className="border-b border-sidebar-border p-3">
            <UserBlock />
          </div>

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

                <div className="border-b border-sidebar-border p-3">
                  <UserBlock />
                </div>

                <nav className="flex-1 overflow-y-auto p-3">
                  <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    منو
                  </div>

                  <NavList
                    onNavigate={() =>
                      setMobileOpen(false)
                    }
                  />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
              <div className="relative min-w-0 max-w-md flex-1">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="جستجو در معاملات، ژورنال..."
                  className="h-10 border-border bg-secondary/60 pr-9 text-sm"
                />
              </div>

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

          {/* Page header */}
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

          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}