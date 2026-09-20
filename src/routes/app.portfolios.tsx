import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  MoreVertical,
  Wallet,
  Archive,
  Edit,
  Link2,
  Trash2,
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
  deletePortfolio,
  updatePortfolio,
  archivePortfolio,
  type Portfolio,
} from "@/api/portfolio";

import { toast } from "sonner";

export const Route = createFileRoute("/app/portfolios")({
  head: () => ({
    meta: [{ title: "پرتفولیوها" }],
  }),
  component: Portfolios,
});

function Portfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // دیالوگ ساخت
  const [open, setOpen] = useState(false);

  // دیالوگ حذف
  const [portfolioToDelete, setPortfolioToDelete] =
    useState<Portfolio | null>(null);

  // دیالوگ ویرایش
  const [portfolioToEdit, setPortfolioToEdit] =
    useState<Portfolio | null>(null);

  // دیالوگ آرشیو
  const [portfolioToArchive, setPortfolioToArchive] =
    useState<Portfolio | null>(null);

  // جلوگیری از برگشت آیتم آرشیوشده
  const [archivedIds, setArchivedIds] = useState<Set<string>>(
    () => new Set(),
  );

  // فرم
  const [name, setName] = useState("");
  const [broker, setBroker] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [leverage, setLeverage] = useState("1:100");

  /**
   * دریافت پرتفولیوها
   */
  async function loadPortfolios() {
    try {
      setLoading(true);

      const data = await getPortfolios();

      console.log("Portfolios from API:", data);

      setPortfolios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Get portfolios error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "دریافت پرتفولیوها ناموفق بود",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPortfolios();
  }, []);

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
   * ساخت پرتفولیو
   */
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedBroker = broker.trim();

    if (!trimmedName || !trimmedBroker) {
      toast.error("نام و بروکر الزامی است");
      return;
    }

    const initialBalance = Number(balance);

    if (!Number.isFinite(initialBalance) || initialBalance < 0) {
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

      toast.success(`پرتفولیو «${trimmedName}» ساخته شد`);

      resetForm();
      setOpen(false);

      await loadPortfolios();
    } catch (error) {
      console.error("Create portfolio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "ساخت پرتفولیو ناموفق بود",
      );
    } finally {
      setCreating(false);
    }
  }

  /**
   * باز کردن فرم ویرایش
   */
  function openEditPortfolio(portfolio: Portfolio) {
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
  async function submitEdit(e: FormEvent<HTMLFormElement>) {
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

    if (!Number.isFinite(newBalance) || newBalance < 0) {
      toast.error("موجودی را صحیح وارد کنید");
      return;
    }

    try {
      setUpdating(true);

      await updatePortfolio(portfolioToEdit.id, {
        name: trimmedName,
        broker: trimmedBroker,
        balance: newBalance,
        currency,
        leverage,
      });

      toast.success(
        `پرتفولیو «${trimmedName}» با موفقیت ویرایش شد`,
      );

      setPortfolioToEdit(null);
      resetForm();

      await loadPortfolios();
    } catch (error) {
      console.error("Update portfolio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "ویرایش پرتفولیو ناموفق بود",
      );
    } finally {
      setUpdating(false);
    }
  }

  /**
   * باز کردن تأیید آرشیو
   */
  function askArchivePortfolio(portfolio: Portfolio) {
    setPortfolioToArchive(portfolio);
  }

  /**
   * آرشیو پرتفولیو
   */
  async function confirmArchivePortfolio() {
    if (!portfolioToArchive) {
      return;
    }

    const portfolio = portfolioToArchive;
    const id = String(portfolio.id);

    try {
      setArchiving(true);

      console.log("Archiving portfolio:", id);

      await archivePortfolio(portfolio.id);

      setArchivedIds((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });

      setPortfolios((current) =>
        current.filter((p) => String(p.id) !== id),
      );

      toast.success(
        `پرتفولیو «${portfolio.name}» آرشیو شد`,
      );

      setPortfolioToArchive(null);

      await loadPortfolios();
    } catch (error) {
      console.error("Archive portfolio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "آرشیو پرتفولیو ناموفق بود",
      );
    } finally {
      setArchiving(false);
    }
  }

  /**
   * باز کردن تأیید حذف
   */
  function askDeletePortfolio(portfolio: Portfolio) {
    setPortfolioToDelete(portfolio);
  }

  /**
   * حذف پرتفولیو
   */
  async function confirmDeletePortfolio() {
    if (!portfolioToDelete) {
      return;
    }

    const portfolio = portfolioToDelete;

    try {
      setDeleting(true);

      await deletePortfolio(portfolio.id);

      toast.success(
        `پرتفولیو «${portfolio.name}» حذف شد`,
      );

      setPortfolios((current) =>
        current.filter((p) => p.id !== portfolio.id),
      );

      setPortfolioToDelete(null);
    } catch (error) {
      console.error("Delete portfolio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "حذف پرتفولیو ناموفق بود",
      );
    } finally {
      setDeleting(false);
    }
  }

  /**
   * فقط پرتفولیوهای فعال
   */
  const activePortfolios = portfolios.filter((p) => {
    const id = String(p.id);

    if (archivedIds.has(id)) {
      return false;
    }

    if (p.is_archived === true) {
      return false;
    }

    if (p.archived === true) {
      return false;
    }

    const status = String(p.status ?? "")
      .trim()
      .toLowerCase();

    if (
      [
        "archived",
        "archive",
        "آرشیو",
        "آرشیو شده",
        "آرشیوشده",
      ].includes(status)
    ) {
      return false;
    }

    return true;
  });

  return (
    <AppShell
      title="پرتفولیوها"
      subtitle="مدیریت حساب‌های معاملاتی و اتصال به بروکرها"
      actions={
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
              پرتفولیو جدید
            </Button>
          </DialogTrigger>

          <DialogContent
            dir="rtl"
            className="w-[calc(100%-1.5rem)] max-w-lg max-h-[90vh] overflow-y-auto text-right"
          >
            <form onSubmit={submit}>
              <DialogHeader className="text-right">
                <DialogTitle className="text-right">
                  پرتفولیو جدید
                </DialogTitle>

                <DialogDescription className="pt-2 text-right leading-7">
                  یک حساب معاملاتی جدید اضافه کن.
                  بعداً می‌توانی به MT4/MT5 متصل کنی.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>نام پرتفولیو</Label>

                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="پرتفوی اصلی"
                    className="bg-secondary/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label>بروکر</Label>

                  <Input
                    value={broker}
                    onChange={(e) => setBroker(e.target.value)}
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
                    onChange={(e) => setBalance(e.target.value)}
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
                      {["USD", "USDT", "EUR", "IRR"].map((c) => (
                        <SelectItem key={c} value={c}>
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
                        <SelectItem key={item} value={item}>
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
                    : "ایجاد پرتفولیو"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            در حال دریافت پرتفولیوها...
          </div>
        </div>
      ) : activePortfolios.length === 0 ? (
        <div className="card-surface flex min-h-60 flex-col items-center justify-center p-8 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            هنوز پرتفولیویی نداری
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            اولین پرتفولیوی خودت را بساز.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activePortfolios.map((p) => {
            const currentBalance = Number(p.balance) || 0;

            const initialBalance =
              Number(p.initial ?? p.balance) || 0;

            const pnl = currentBalance - initialBalance;

            const pct =
              initialBalance > 0
                ? (pnl / initialBalance) * 100
                : 0;

            return (
              <div
                key={String(p.id)}
                className="card-surface p-5 transition-all hover:border-primary/40"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-semibold">
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
                      toast.info("منوی گزینه‌ها به‌زودی")
                    }
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Balance / PNL */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/40 p-3">
                    <div className="text-[11px] text-muted-foreground">
                      موجودی فعلی
                    </div>

                    <div className="mt-1 text-lg font-bold tabular">
                      {p.currency === "IRR" ? "" : "$"}
                      {currentBalance.toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-lg bg-secondary/40 p-3">
                    <div className="text-[11px] text-muted-foreground">
                      سود / زیان
                    </div>

                    <div
                      className={`mt-1 text-lg font-bold tabular ${
                        pnl >= 0 ? "gain" : "loss"
                      }`}
                    >
                      {pnl >= 0 ? "+" : "-"}
                      {p.currency === "IRR" ? "" : "$"}
                      {Math.abs(pnl).toLocaleString()}
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
                      {p.trades ?? 0}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <Badge
                    variant="outline"
                    className={
                      p.status === "فعال"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : ""
                    }
                  >
                    {p.status || "فعال"}
                  </Badge>

                  <div
                    className={`text-sm font-medium tabular ${
                      pct >= 0 ? "gain" : "loss"
                    }`}
                  >
                    {pct >= 0 ? "+" : ""}
                    {pct.toFixed(2)}٪
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-2">
                  {/* اتصال MT */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="min-w-0 flex-1"
                    onClick={() =>
                      toast.success(
                        `اتصال ${p.name} به متاتریدر شروع شد`,
                      )
                    }
                  >
                    <Link2 className="ml-1 h-3 w-3" />
                    اتصال MT
                  </Button>

                  {/* ویرایش */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    title="ویرایش پرتفولیو"
                    onClick={() => openEditPortfolio(p)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  {/* آرشیو */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    title="آرشیو پرتفولیو"
                    disabled={archiving}
                    onClick={() => askArchivePortfolio(p)}
                    className="border-yellow-500/40 text-yellow-600 transition-all hover:bg-yellow-500/10 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-400"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>

                  {/* حذف */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    title="حذف پرتفولیو"
                    disabled={deleting}
                    onClick={() => askDeletePortfolio(p)}
                    className="border-red-500/40 text-red-500 transition-all hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          ویرایش پرتفولیو
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
                ویرایش پرتفولیو
              </DialogTitle>

              <DialogDescription className="pt-2 text-right leading-7">
                اطلاعات پرتفولیو را تغییر دهید و سپس روی
                «ذخیره تغییرات» بزنید.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>نام پرتفولیو</Label>

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label>بروکر</Label>

                <Input
                  value={broker}
                  onChange={(e) => setBroker(e.target.value)}
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
                  onChange={(e) => setBalance(e.target.value)}
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
                    {["USD", "USDT", "EUR", "IRR"].map((c) => (
                      <SelectItem key={c} value={c}>
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
                      <SelectItem key={item} value={item}>
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

              <span>آرشیو پرتفولیو</span>
            </DialogTitle>

            <DialogDescription className="break-words pt-4 text-right text-sm leading-8">
              آیا مطمئن هستید که می‌خواهید پرتفولیوی{" "}
              <span className="font-bold text-foreground">
                «{portfolioToArchive?.name}»
              </span>{" "}
              را آرشیو کنید؟
            </DialogDescription>

            <div className="mt-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-right text-sm font-medium leading-7 text-yellow-600 dark:text-yellow-400">
              <span className="font-bold">📦 توجه:</span>{" "}
              پرتفولیو حذف نمی‌شود و اطلاعات آن در سیستم
              باقی می‌ماند؛ فقط از لیست پرتفولیوهای فعال
              خارج می‌شود.
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
            {/* بله — سمت راست */}
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
              {archiving ? "در حال آرشیو..." : "بله"}
            </Button>

            {/* خیر — سمت چپ */}
            <Button
              type="button"
              variant="outline"
              disabled={archiving}
              onClick={() => setPortfolioToArchive(null)}
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

              <span>حذف پرتفولیو</span>
            </DialogTitle>

            <DialogDescription className="break-words pt-4 text-right text-sm leading-8">
              آیا مطمئن هستید که می‌خواهید پرتفولیوی{" "}
              <span className="font-bold text-foreground">
                «{portfolioToDelete?.name}»
              </span>{" "}
              را حذف کنید؟
            </DialogDescription>

            <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-right text-sm font-medium leading-7 text-red-500 dark:text-red-400">
              <span className="font-bold">⚠️ توجه:</span>{" "}
              پس از حذف، اطلاعات این پرتفولیو قابل
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
            {/* بله — سمت راست */}
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
              {deleting ? "در حال حذف..." : "بله"}
            </Button>

            {/* خیر — سمت چپ */}
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setPortfolioToDelete(null)}
              className="
                flex-1
                border-border
                transition-colors
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