import { createFileRoute } from "@tanstack/react-router";

import {
  Plus,
  MoreVertical,
  Wallet,
  Archive,
  Edit,
  Link2,
  Trash2,
  X,
  Check,
} from "lucide-react";

import { useEffect, useState, type FormEvent } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createPortfolio,
  getPortfolios,
  getArchivedPortfolios,
  deletePortfolio,
  updatePortfolio,
  archivePortfolio,
  restorePortfolio,
  activatePortfolio as activatePortfolioApi,
  type Portfolio,
} from "@/api/portfolio";

import { toast } from "sonner";

export const Route = createFileRoute("/app/portfolios")({
  head: () => ({
    meta: [{ title: "پرتفولیوها" }],
  }),
  component: Portfolios,
});

/**
 * این کلید باید در تمام صفحات پروژه یکسان باشد.
 */
export const ACTIVE_PORTFOLIO_STORAGE_KEY =
  "traderjournal-active-portfolio";

/**
 * اطلاع‌رسانی به سایر صفحات برنامه
 * وقتی پرتفولیوی فعال تغییر می‌کند.
 */
export const ACTIVE_PORTFOLIO_CHANGED_EVENT =
  "traderjournal-active-portfolio-changed";

function notifyActivePortfolioChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event(ACTIVE_PORTFOLIO_CHANGED_EVENT),
  );
}

function Portfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [archivedPortfolios, setArchivedPortfolios] =
    useState<Portfolio[]>([]);

  const [loading, setLoading] = useState(true);
  const [archivedLoading, setArchivedLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const [activePortfolioId, setActivePortfolioId] = useState<string | null>(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem(ACTIVE_PORTFOLIO_STORAGE_KEY)
        : null,
  );

  // ساخت
  const [open, setOpen] = useState(false);

  // آرشیوها
  const [archivedOpen, setArchivedOpen] = useState(false);

  // حذف
  const [portfolioToDelete, setPortfolioToDelete] =
    useState<Portfolio | null>(null);

  // ویرایش
  const [portfolioToEdit, setPortfolioToEdit] =
    useState<Portfolio | null>(null);

  // آرشیو
  const [portfolioToArchive, setPortfolioToArchive] =
    useState<Portfolio | null>(null);

  // فرم
  const [name, setName] = useState("");
  const [broker, setBroker] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [leverage, setLeverage] = useState("1:100");

  /**
   * تشخیص آرشیوشده بودن
   */
  function isPortfolioArchived(portfolio: Portfolio) {
    if (portfolio.is_archived === true) {
      return true;
    }

    if (portfolio.archived === true) {
      return true;
    }

    const status = String(portfolio.status ?? "")
      .trim()
      .toLowerCase();

    return [
      "archived",
      "archive",
      "آرشیو",
      "آرشیو شده",
      "آرشیوشده",
    ].includes(status);
  }

  /**
   * دریافت پرتفلیوهای اصلی
   *
   * نکته مهم:
   * این تابع به هیچ عنوان sort نمی‌کند.
   * ترتیب دریافتی از API دقیقاً حفظ می‌شود.
   */
  async function loadPortfolios() {
    try {
      setLoading(true);

      const data = await getPortfolios();

      const list = Array.isArray(data) ? data : [];

      // فقط فیلتر می‌کنیم؛ ترتیب آرایه دست‌نخورده باقی می‌ماند.
      const activeList = list.filter(
        (portfolio) => !isPortfolioArchived(portfolio),
      );

      setPortfolios(activeList);

      /**
       * وضعیت فعال را از بک‌اند پیدا می‌کنیم،
       * ولی به هیچ عنوان آن را به ابتدای لیست منتقل نمی‌کنیم.
       */
      const backendActivePortfolio = activeList.find(
        (portfolio) => portfolio.is_active === true,
      );

      if (backendActivePortfolio) {
        const id = String(backendActivePortfolio.id);

        setActivePortfolioId(id);

        if (typeof window !== "undefined") {
          const previousId = localStorage.getItem(
            ACTIVE_PORTFOLIO_STORAGE_KEY,
          );

          localStorage.setItem(
            ACTIVE_PORTFOLIO_STORAGE_KEY,
            id,
          );

          if (previousId !== id) {
            notifyActivePortfolioChanged();
          }
        }
      } else {
        /**
         * اگر بک‌اند هیچ پرتفلیوی فعالی ندارد،
         * وضعیت قبلی localStorage هم نباید باعث نمایش
         * اشتباه پرتفلیوی فعال شود.
         */
        setActivePortfolioId(null);

        if (typeof window !== "undefined") {
          localStorage.removeItem(
            ACTIVE_PORTFOLIO_STORAGE_KEY,
          );
        }
      }
    } catch (error) {
      console.error("Get portfolios error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "دریافت پرتفلیوها ناموفق بود",
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * دریافت آرشیوها
   */
  async function loadArchivedPortfolios() {
    try {
      setArchivedLoading(true);

      const data = await getArchivedPortfolios();

      const list = Array.isArray(data) ? data : [];

      setArchivedPortfolios(list);
    } catch (error) {
      console.error(
        "Get archived portfolios error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "دریافت پرتفلیوهای آرشیو شده ناموفق بود",
      );
    } finally {
      setArchivedLoading(false);
    }
  }

  /**
   * بارگذاری اولیه
   */
  useEffect(() => {
    void Promise.all([
      loadPortfolios(),
      loadArchivedPortfolios(),
    ]);
  }, []);

  /**
   * فعال‌سازی پرتفلیو
   *
   * نکته مهم:
   * این تابع فقط is_active را تغییر می‌دهد.
   * هیچ sort، unshift، prepend یا جابه‌جایی انجام نمی‌شود.
   */
  async function handleActivatePortfolio(
    portfolio: Portfolio,
  ) {
    const id = String(portfolio.id);

    if (activePortfolioId === id) {
      toast.info(
        `پرتفلیو «${portfolio.name}» در حال حاضر فعال است`,
      );
      return;
    }

    if (activatingId !== null) {
      return;
    }

    try {
      setActivatingId(id);

      // API فعال‌سازی
      await activatePortfolioApi(portfolio.id);

      /**
       * فقط وضعیت فعال بودن را تغییر می‌دهیم.
       * ترتیب current دقیقاً همان قبلی باقی می‌ماند.
       */
      setPortfolios((current) =>
        current.map((item) => ({
          ...item,
          is_active: String(item.id) === id,
        })),
      );

      setActivePortfolioId(id);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          ACTIVE_PORTFOLIO_STORAGE_KEY,
          id,
        );

        notifyActivePortfolioChanged();
      }

      toast.success(
        `پرتفلیو «${portfolio.name}» فعال شد`,
      );
    } catch (error) {
      console.error(
        "Activate portfolio error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "فعال‌سازی پرتفلیو ناموفق بود",
      );
    } finally {
      setActivatingId(null);
    }
  }

  /**
   * بررسی فعال بودن
   */
  function isPortfolioActive(portfolio: Portfolio) {
    return activePortfolioId === String(portfolio.id);
  }

  /**
   * ریست فرم
   */
  function resetForm() {
    setName("");
    setBroker("");
    setBalance("");
    setCurrency("USD");
    setLeverage("1:100");
  }

  /**
   * ساخت پرتفلیو
   */
  async function submit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedBroker = broker.trim();

    if (!trimmedName || !trimmedBroker) {
      toast.error("نام و بروکر الزامی است");
      return;
    }

    const initialBalance = Number(balance);

    if (
      !Number.isFinite(initialBalance) ||
      initialBalance < 0
    ) {
      toast.error("موجودی اولیه را صحیح وارد کنید");
      return;
    }

    try {
      setCreating(true);

      await createPortfolio({
        name: trimmedName,
        broker: trimmedBroker,
        balance: initialBalance,
        currency,
        leverage,
      });

      toast.success(
        `پرتفلیو «${trimmedName}» ساخته شد`,
      );

      resetForm();
      setOpen(false);

      await Promise.all([
        loadPortfolios(),
        loadArchivedPortfolios(),
      ]);
    } catch (error) {
      console.error(
        "Create portfolio error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "ساخت پرتفلیو ناموفق بود",
      );
    } finally {
      setCreating(false);
    }
  }

  /**
   * باز کردن ویرایش
   */
  function openEditPortfolio(
    portfolio: Portfolio,
  ) {
    setPortfolioToEdit(portfolio);

    setName(portfolio.name ?? "");
    setBroker(portfolio.broker ?? "");
    setBalance(String(portfolio.balance ?? ""));
    setCurrency(portfolio.currency ?? "USD");
    setLeverage(portfolio.leverage ?? "1:100");
  }

  /**
   * ذخیره ویرایش
   */
  async function submitEdit(
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!portfolioToEdit) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedBroker = broker.trim();

    if (!trimmedName || !trimmedBroker) {
      toast.error("نام و بروکر الزامی است");
      return;
    }

    const newBalance = Number(balance);

    if (
      !Number.isFinite(newBalance) ||
      newBalance < 0
    ) {
      toast.error("موجودی را صحیح وارد کنید");
      return;
    }

    try {
      setUpdating(true);

      await updatePortfolio(
        portfolioToEdit.id,
        {
          name: trimmedName,
          broker: trimmedBroker,
          balance: newBalance,
          currency,
          leverage,
        },
      );

      toast.success(
        `پرتفلیو «${trimmedName}» با موفقیت ویرایش شد`,
      );

      setPortfolioToEdit(null);
      resetForm();

      await Promise.all([
        loadPortfolios(),
        loadArchivedPortfolios(),
      ]);
    } catch (error) {
      console.error(
        "Update portfolio error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "ویرایش پرتفلیو ناموفق بود",
      );
    } finally {
      setUpdating(false);
    }
  }

  /**
   * باز کردن تأیید آرشیو
   */
  function askArchivePortfolio(
    portfolio: Portfolio,
  ) {
    setPortfolioToArchive(portfolio);
  }

  /**
   * آرشیو
   */
  async function confirmArchivePortfolio() {
    if (!portfolioToArchive) {
      return;
    }

    const portfolio = portfolioToArchive;
    const id = String(portfolio.id);

    try {
      setArchiving(true);

      await archivePortfolio(portfolio.id);

      if (activePortfolioId === id) {
        setActivePortfolioId(null);

        if (typeof window !== "undefined") {
          localStorage.removeItem(
            ACTIVE_PORTFOLIO_STORAGE_KEY,
          );

          notifyActivePortfolioChanged();
        }
      }

      setPortfolioToArchive(null);

      toast.success(
        `پرتفلیو «${portfolio.name}» آرشیو شد`,
      );

      await Promise.all([
        loadPortfolios(),
        loadArchivedPortfolios(),
      ]);
    } catch (error) {
      console.error(
        "Archive portfolio error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "آرشیو پرتفلیو ناموفق بود",
      );
    } finally {
      setArchiving(false);
    }
  }

  /**
   * باز کردن تأیید حذف
   */
  function askDeletePortfolio(
    portfolio: Portfolio,
  ) {
    setPortfolioToDelete(portfolio);
  }

  /**
   * حذف
   */
  async function confirmDeletePortfolio() {
    if (!portfolioToDelete) {
      return;
    }

    const portfolio = portfolioToDelete;
    const id = String(portfolio.id);

    try {
      setDeleting(true);

      await deletePortfolio(portfolio.id);

      toast.success(
        `پرتفلیو «${portfolio.name}» حذف شد`,
      );

      setPortfolios((current) =>
        current.filter(
          (item) => String(item.id) !== id,
        ),
      );

      setArchivedPortfolios((current) =>
        current.filter(
          (item) => String(item.id) !== id,
        ),
      );

      if (activePortfolioId === id) {
        setActivePortfolioId(null);

        if (typeof window !== "undefined") {
          localStorage.removeItem(
            ACTIVE_PORTFOLIO_STORAGE_KEY,
          );

          notifyActivePortfolioChanged();
        }
      }

      setPortfolioToDelete(null);
    } catch (error) {
      console.error(
        "Delete portfolio error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "حذف پرتفلیو ناموفق بود",
      );
    } finally {
      setDeleting(false);
    }
  }

  /**
   * بازیابی پرتفلیوی آرشیوشده
   */
  async function handleRestorePortfolio(
    portfolio: Portfolio,
  ) {
    const id = String(portfolio.id);

    if (restoringId !== null) {
      return;
    }

    try {
      setRestoringId(id);

      await restorePortfolio(portfolio.id);

      toast.success(
        `پرتفلیو «${portfolio.name}» بازیابی شد`,
      );

      await Promise.all([
        loadPortfolios(),
        loadArchivedPortfolios(),
      ]);
    } catch (error) {
      console.error(
        "Restore portfolio error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "بازیابی پرتفلیو ناموفق بود",
      );
    } finally {
      setRestoringId(null);
    }
  }

  /**
   * کارت پرتفلیو
   */
  function PortfolioCard({
    p,
    archived = false,
  }: {
    p: Portfolio;
    archived?: boolean;
  }) {
    const currentBalance =
      Number(p.balance) || 0;

    /**
     * اول از اطلاعات واقعی بک‌اند استفاده می‌کنیم.
     * اگر موجود نبود، محاسبه قبلی انجام می‌شود.
     */
    const backendPnl = Number(p.profit_loss);
    const hasBackendPnl = Number.isFinite(
      backendPnl,
    );

    const initialBalance =
      Number(
        p.initial ?? p.balance,
      ) || 0;

    const calculatedPnl =
      currentBalance - initialBalance;

    const pnl = hasBackendPnl
      ? backendPnl
      : calculatedPnl;

    const backendPct = Number(
      p.profit_percentage,
    );

    const hasBackendPct = Number.isFinite(
      backendPct,
    );

    const calculatedPct =
      initialBalance > 0
        ? (calculatedPnl / initialBalance) * 100
        : 0;

    const pct = hasBackendPct
      ? backendPct
      : calculatedPct;

    const isActive =
      !archived &&
      isPortfolioActive(p);

    return (
      <div
        className={`card-surface p-5 transition-all duration-300 ${
          isActive
            ? "border-2 border-primary/70 bg-primary/[0.055] shadow-[0_0_0_3px_hsl(var(--primary)/0.08),0_8px_30px_hsl(var(--primary)/0.10)] ring-1 ring-primary/30"
            : "border border-transparent hover:border-primary/40"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-primary/15 text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.06)]"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Wallet className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div
                className={`truncate font-semibold ${
                  isActive
                    ? "text-primary"
                    : ""
                }`}
              >
                {p.name}
              </div>

              <div className="truncate text-xs text-muted-foreground">
                {p.broker}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() =>
              toast.info(
                "منوی گزینه‌ها به‌زودی",
              )
            }
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Balance / PNL */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            className={`rounded-lg p-3 ${
              isActive
                ? "bg-primary/[0.07]"
                : "bg-secondary/40"
            }`}
          >
            <div className="text-[11px] text-muted-foreground">
              موجودی فعلی
            </div>

            <div className="mt-1 text-lg font-bold tabular">
              {p.currency === "IRR"
                ? ""
                : "$"}
              {currentBalance.toLocaleString()}
            </div>
          </div>

          <div
            className={`rounded-lg p-3 ${
              isActive
                ? "bg-primary/[0.07]"
                : "bg-secondary/40"
            }`}
          >
            <div className="text-[11px] text-muted-foreground">
              سود / زیان
            </div>

            <div
              className={`mt-1 text-lg font-bold tabular ${
                pnl >= 0
                  ? "gain"
                  : "loss"
              }`}
            >
              {pnl >= 0 ? "+" : "-"}
              {p.currency === "IRR"
                ? ""
                : "$"}
              {Math.abs(
                pnl,
              ).toLocaleString()}
            </div>
          </div>
        </div>

        {/* اطلاعات */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="min-w-0">
            <span className="text-muted-foreground">
              لوریج:
            </span>{" "}
            <span className="tabular">
              {p.leverage ?? "1:100"}
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-muted-foreground">
              ارز:
            </span>{" "}
            {p.currency ?? "USD"}
          </div>

          <div className="min-w-0">
            <span className="text-muted-foreground">
              معاملات:
            </span>{" "}
            <span className="tabular">
              {p.transactions_count ??
                p.trades ??
                0}
            </span>
          </div>
        </div>

        {/* Status */}
        <div
          className={`mt-5 flex items-center justify-between gap-3 border-t pt-4 ${
            isActive
              ? "border-primary/20"
              : "border-border"
          }`}
        >
          <Badge
            variant="outline"
            className={
              archived
                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                : isActive
                  ? "border-primary/60 bg-primary/15 font-semibold text-primary shadow-sm"
                  : ""
            }
          >
            {archived
              ? "آرشیو شده"
              : isActive
                ? "فعال"
                : p.status ||
                  "غیرفعال"}
          </Badge>

          <div
            className={`text-sm font-medium tabular ${
              pct >= 0
                ? "gain"
                : "loss"
            }`}
          >
            {pct >= 0 ? "+" : ""}
            {pct.toFixed(2)}٪
          </div>
        </div>

        {/* Buttons */}
        {!archived ? (
          <div className="mt-4 flex gap-2">
            {/* فعال‌سازی */}
            <Button
              type="button"
              size="sm"
              title="فعال‌سازی پرتفلیو"
              variant={
                isActive
                  ? "default"
                  : "outline"
              }
              className={`min-w-0 flex-1 transition-all duration-300 ${
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90"
                  : ""
              }`}
              disabled={
                activatingId !== null
              }
              onClick={() =>
                void handleActivatePortfolio(
                  p,
                )
              }
            >
              {activatingId ===
              String(p.id) ? (
                "در حال فعال‌سازی..."
              ) : isActive ? (
                <>
                  <Check className="ml-1 h-3 w-3" />
                  فعال
                </>
              ) : (
                <>
                  <Link2 className="ml-1 h-3 w-3" />
                  فعال‌سازی
                </>
              )}
            </Button>

            {/* ویرایش */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              title="ویرایش پرتفلیو"
              onClick={() =>
                openEditPortfolio(p)
              }
            >
              <Edit className="h-3 w-3" />
            </Button>

            {/* آرشیو */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              title="آرشیو پرتفلیو"
              disabled={archiving}
              onClick={() =>
                askArchivePortfolio(p)
              }
              className="border-yellow-500/40 text-yellow-600 transition-all hover:bg-yellow-500/10 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-400"
            >
              <Archive className="h-3 w-3" />
            </Button>

            {/* حذف */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              title="حذف پرتفلیو"
              disabled={deleting}
              onClick={() =>
                askDeletePortfolio(p)
              }
              className="border-red-500/40 text-red-500 transition-all hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Button
              type="button"
              size="sm"
              variant="outline"
              title="بازیابی پرتفلیو"
              disabled={
                restoringId !== null
              }
              className="w-full border-yellow-500/40 text-yellow-600 transition-all hover:bg-yellow-500/10 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-400"
              onClick={() =>
                void handleRestorePortfolio(
                  p,
                )
              }
            >
              <Archive className="ml-1 h-3 w-3" />

              {restoringId ===
              String(p.id)
                ? "در حال بازیابی..."
                : "بازیابی"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  /**
   * مهم:
   * فقط فیلتر می‌کنیم.
   * هیچ sort انجام نمی‌شود.
   */
  const activePortfolios =
    portfolios.filter(
      (portfolio) =>
        !isPortfolioArchived(portfolio),
    );

  return (
    <AppShell
      title="پرتفلیوها"
      subtitle="مدیریت حساب‌های معاملاتی و اتصال به بروکرها"
      actions={
        <div className="flex items-center gap-2">
          {/* آرشیو شده‌ها */}
          <Button
            type="button"
            onClick={() => {
              setArchivedOpen(true);
              void loadArchivedPortfolios();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Archive className="ml-1 h-4 w-4" />
            پرتفلیوهای آرشیو شده
          </Button>

          {/* پرتفلیو جدید */}
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);

              if (!value && !creating) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="ml-1 h-4 w-4" />
                پرتفلیو جدید
              </Button>
            </DialogTrigger>

            <DialogContent
              dir="rtl"
              className="w-[calc(100%-1.5rem)] max-w-lg max-h-[90vh] overflow-y-auto text-right"
            >
              <form onSubmit={submit}>
                <DialogHeader className="text-right">
                  <DialogTitle className="text-right">
                    پرتفلیو جدید
                  </DialogTitle>

                  <DialogDescription className="pt-2 text-right leading-7">
                    یک حساب معاملاتی جدید اضافه کن.
                    بعداً می‌توانی به MT4/MT5 متصل کنی.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>نام پرتفلیو</Label>

                    <Input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="پرتفوی اصلی"
                      className="bg-secondary/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>بروکر</Label>

                    <Input
                      value={broker}
                      onChange={(e) =>
                        setBroker(e.target.value)
                      }
                      placeholder="IC Markets"
                      className="bg-secondary/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>موجودی اولیه</Label>

                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={balance}
                      onChange={(e) =>
                        setBalance(e.target.value)
                      }
                      placeholder="10000"
                      className="bg-secondary/60 tabular"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ارز</Label>

                    <Select
                      value={currency}
                      onValueChange={setCurrency}
                    >
                      <SelectTrigger className="bg-secondary/60">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {[
                          "USD",
                          "USDT",
                          "EUR",
                          "IRR",
                        ].map((c) => (
                          <SelectItem
                            key={c}
                            value={c}
                          >
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>لوریج</Label>

                    <Select
                      value={leverage}
                      onValueChange={setLeverage}
                    >
                      <SelectTrigger className="bg-secondary/60">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {[
                          "1:1",
                          "1:30",
                          "1:100",
                          "1:200",
                          "1:500",
                        ].map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter
                  className="
                    mt-6
                    flex
                    flex-col-reverse
                    gap-3
                    sm:flex-row
                    sm:gap-3
                    [&>*]:w-full
                    sm:[&>*]:flex-1
                    sm:[&>*]:w-auto
                  "
                >
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={creating}
                      className="w-full"
                    >
                      انصراف
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={creating}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {creating
                      ? "در حال ساخت..."
                      : "ایجاد پرتفلیو"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            در حال دریافت پرتفلیوها...
          </div>
        </div>
      ) : activePortfolios.length === 0 ? (
        <div className="card-surface flex min-h-60 flex-col items-center justify-center p-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            هنوز پرتفلیویی نداری
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            اولین پرتفلیوی خودت را بساز.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/*
            ترتیب این map دقیقاً همان ترتیب API است.
            فعال شدن هیچ تغییری در جای کارت ایجاد نمی‌کند.
          */}
          {activePortfolios.map((p) => (
            <PortfolioCard
              key={String(p.id)}
              p={p}
            />
          ))}
        </div>
      )}

      {/* =====================================================
          پرتفلیوهای آرشیو شده
         ===================================================== */}
      <Dialog
        open={archivedOpen}
        onOpenChange={setArchivedOpen}
      >
        <DialogContent
          dir="rtl"
          className="w-[calc(100%-1.5rem)] max-w-5xl max-h-[90vh] overflow-y-auto text-right"
        >
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-3 text-right text-xl font-bold">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Archive className="h-5 w-5" />
              </span>

              <span>
                پرتفلیوهای آرشیو شده
              </span>
            </DialogTitle>

            <DialogDescription className="pt-2 text-right leading-7">
              پرتفلیوهایی که آرشیو کرده‌ای در این قسمت
              نگهداری می‌شوند و از لیست اصلی پرتفلیوها جدا هستند.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5">
            {archivedLoading ? (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-border">
                <div className="text-sm text-muted-foreground">
                  در حال دریافت پرتفلیوهای آرشیو شده...
                </div>
              </div>
            ) : archivedPortfolios.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-yellow-500/10 text-yellow-500">
                  <Archive className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-base font-semibold">
                  هنوز پرتفلیو آرشیوشده‌ای وجود ندارد
                </h3>

                <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                  وقتی یک پرتفلیو را آرشیو کنی، از لیست اصلی
                  حذف می‌شود و در این قسمت باقی می‌ماند.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {archivedPortfolios.map((p) => (
                  <PortfolioCard
                    key={String(p.id)}
                    p={p}
                    archived
                  />
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setArchivedOpen(false)
              }
              className="w-full sm:w-auto"
            >
              <X className="ml-1 h-4 w-4" />
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          ویرایش پرتفلیو
         ===================================================== */}
      <Dialog
        open={!!portfolioToEdit}
        onOpenChange={(value) => {
          if (!value && !updating) {
            setPortfolioToEdit(null);
            resetForm();
          }
        }}
      >
        <DialogContent
          dir="rtl"
          className="w-[calc(100%-1.5rem)] max-w-lg max-h-[90vh] overflow-y-auto text-right"
        >
          <form onSubmit={submitEdit}>
            <DialogHeader className="text-right">
              <DialogTitle className="text-right text-xl font-bold">
                ویرایش پرتفلیو
              </DialogTitle>

              <DialogDescription className="pt-2 text-right leading-7">
                اطلاعات پرتفلیو را تغییر دهید و سپس روی
                «ذخیره تغییرات» بزنید.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>نام پرتفلیو</Label>

                <Input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label>بروکر</Label>

                <Input
                  value={broker}
                  onChange={(e) =>
                    setBroker(e.target.value)
                  }
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label>موجودی</Label>

                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={balance}
                  onChange={(e) =>
                    setBalance(e.target.value)
                  }
                  className="bg-secondary/60 tabular"
                />
              </div>

              <div className="space-y-2">
                <Label>ارز</Label>

                <Select
                  value={currency}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger className="bg-secondary/60">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {[
                      "USD",
                      "USDT",
                      "EUR",
                      "IRR",
                    ].map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>لوریج</Label>

                <Select
                  value={leverage}
                  onValueChange={setLeverage}
                >
                  <SelectTrigger className="bg-secondary/60">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {[
                      "1:1",
                      "1:30",
                      "1:100",
                      "1:200",
                      "1:500",
                    ].map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:gap-3
                [&>*]:w-full
                sm:[&>*]:flex-1
                sm:[&>*]:w-auto
              "
            >
              <Button
                type="button"
                variant="outline"
                disabled={updating}
                onClick={() => {
                  setPortfolioToEdit(null);
                  resetForm();
                }}
                className="w-full"
              >
                انصراف
              </Button>

              <Button
                type="submit"
                disabled={updating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {updating
                  ? "در حال ذخیره..."
                  : "ذخیره تغییرات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          تأیید آرشیو
         ===================================================== */}
      <Dialog
        open={!!portfolioToArchive}
        onOpenChange={(value) => {
          if (!value && !archiving) {
            setPortfolioToArchive(null);
          }
        }}
      >
        <DialogContent
          dir="rtl"
          className="w-[calc(100%-1.5rem)] max-w-md max-h-[90vh] overflow-y-auto text-right"
        >
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-3 text-right text-lg font-bold">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/15 text-xl text-yellow-500">
                📦
              </span>

              <span>آرشیو پرتفلیو</span>
            </DialogTitle>

            <DialogDescription className="break-words pt-4 text-right text-sm leading-8">
              آیا مطمئن هستید که می‌خواهید پرتفلیوی{" "}
              <span className="font-bold text-foreground">
                «{portfolioToArchive?.name}»
              </span>{" "}
              را آرشیو کنید؟
            </DialogDescription>

            <div className="mt-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-right text-sm font-medium leading-7 text-yellow-600 dark:text-yellow-400">
              <span className="font-bold">
                📦 توجه:
              </span>{" "}
              پرتفلیو حذف نمی‌شود و اطلاعات آن در سیستم
              باقی می‌ماند؛ فقط از لیست پرتفلیوهای فعال
              خارج می‌شود و از بخش «پرتفلیوهای آرشیو شده»
              قابل مشاهده خواهد بود.
            </div>
          </DialogHeader>

          <DialogFooter
            className="
              mt-6
              flex
              flex-row
              gap-3
              [&>*]:flex-1
            "
          >
            <Button
              type="button"
              disabled={archiving}
              onClick={confirmArchivePortfolio}
              className="
                flex-1
                bg-yellow-500
                font-semibold
                text-black
                hover:bg-yellow-500/90
              "
            >
              {archiving
                ? "در حال آرشیو..."
                : "بله"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={archiving}
              onClick={() =>
                setPortfolioToArchive(null)
              }
              className="
                flex-1
                border-border
                transition-colors
                hover:border-yellow-500/40
                hover:bg-yellow-500
                hover:text-black
                dark:hover:bg-yellow-500
                dark:hover:text-black
              "
            >
              خیر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          تأیید حذف
         ===================================================== */}
      <Dialog
        open={!!portfolioToDelete}
        onOpenChange={(value) => {
          if (!value && !deleting) {
            setPortfolioToDelete(null);
          }
        }}
      >
        <DialogContent
          dir="rtl"
          className="w-[calc(100%-1.5rem)] max-w-md max-h-[90vh] overflow-y-auto text-right"
        >
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-3 text-right text-lg font-bold">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-500">
                ⚠️
              </span>

              <span>حذف پرتفلیو</span>
            </DialogTitle>

            <DialogDescription className="break-words pt-4 text-right text-sm leading-8">
              آیا مطمئن هستید که می‌خواهید پرتفلیوی{" "}
              <span className="font-bold text-foreground">
                «{portfolioToDelete?.name}»
              </span>{" "}
              را حذف کنید؟
            </DialogDescription>

            <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-right text-sm font-medium leading-7 text-red-500 dark:text-red-400">
              <span className="font-bold">
                ⚠️ توجه:
              </span>{" "}
              پس از حذف، اطلاعات این پرتفلیو قابل
              بازگردانی نخواهد بود.
            </div>
          </DialogHeader>

          <DialogFooter
            className="
              mt-6
              flex
              flex-row
              gap-3
              [&>*]:flex-1
            "
          >
            <Button
              type="button"
              disabled={deleting}
              onClick={confirmDeletePortfolio}
              className="
                flex-1
                bg-red-500
                font-semibold
                text-white
                shadow-sm
                hover:bg-red-600
              "
            >
              {deleting
                ? "در حال حذف..."
                : "بله"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() =>
                setPortfolioToDelete(null)
              }
              className="
                flex-1
                border-border
                transition-all
                hover:border-red-500/40
                hover:bg-red-500
                hover:text-white
                dark:hover:bg-red-500
                dark:hover:text-white
              "
            >
              خیر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}