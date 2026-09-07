import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

import { getTrades, type Trade } from "@/api/trades";
import { toast } from "sonner";

export const Route = createFileRoute("/app/trades")({
  head: () => ({ meta: [{ title: "معاملات" }] }),
  component: TradesPage,
});

/**
 * این کلید باید دقیقاً با portfolios.tsx یکی باشد.
 */
const ACTIVE_PORTFOLIO_STORAGE_KEY =
  "traderjournal-active-portfolio";

/**
 * برای اطلاع‌رسانی تغییر پرتفولیوی فعال در همان تب.
 */
const ACTIVE_PORTFOLIO_CHANGED_EVENT =
  "traderjournal-active-portfolio-changed";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatNumber(value: string | number): string {
  const numberValue = toNumber(value);

  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function formatPrice(value: string | number): string {
  const numberValue = toNumber(value);

  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits: 5,
  });
}

function formatDate(date: string | null): string {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("fa-IR");
}

function getActivePortfolioId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const portfolioId = localStorage.getItem(
    ACTIVE_PORTFOLIO_STORAGE_KEY,
  );

  return portfolioId && portfolioId.trim()
    ? portfolioId
    : null;
}

function TradesPage() {
  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"all" | "buy" | "sell">("all");
  const [plan, setPlan] = useState<"all" | "yes" | "no">("all");
  const [result, setResult] = useState<"all" | "win" | "loss">("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePortfolioId, setActivePortfolioId] =
    useState<string | null>(null);

  const loadTrades = async (portfolioId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTrades(portfolioId);

      setTrades(data);
    } catch (err) {
      console.error("Failed to load trades:", err);

      const message =
        err instanceof Error
          ? err.message
          : "دریافت معاملات با خطا مواجه شد.";

      setError(message);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * بارگذاری اولیه معاملات بر اساس پرتفولیوی فعال.
   */
  useEffect(() => {
    const portfolioId = getActivePortfolioId();

    setActivePortfolioId(portfolioId);

    if (!portfolioId) {
      setTrades([]);
      setLoading(false);
      setError("هیچ پرتفولیوی فعالی انتخاب نشده است.");
      return;
    }

    void loadTrades(portfolioId);
  }, []);

  /**
   * وقتی پرتفولیو در همان تب تغییر می‌کند،
   * portfolios.tsx این event را ارسال می‌کند.
   *
   * storage هم نگه داشته شده تا اگر تغییر از تب دیگری
   * انجام شد، صفحه معاملات نیز آپدیت شود.
   */
  useEffect(() => {
    const handlePortfolioChange = () => {
      const portfolioId = getActivePortfolioId();

      setActivePortfolioId(portfolioId);

      if (!portfolioId) {
        setTrades([]);
        setLoading(false);
        setError("هیچ پرتفولیوی فعالی انتخاب نشده است.");
        return;
      }

      void loadTrades(portfolioId);
    };

    window.addEventListener(
      "storage",
      handlePortfolioChange,
    );

    window.addEventListener(
      ACTIVE_PORTFOLIO_CHANGED_EVENT,
      handlePortfolioChange,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handlePortfolioChange,
      );

      window.removeEventListener(
        ACTIVE_PORTFOLIO_CHANGED_EVENT,
        handlePortfolioChange,
      );
    };
  }, []);

  const filtered = useMemo(() => {
    return trades.filter((trade) => {
      const symbol = trade.symbol?.toLowerCase() ?? "";
      const search = query.trim().toLowerCase();

      if (search && !symbol.includes(search)) {
        return false;
      }

      if (
        side !== "all" &&
        trade.transaction_type.toLowerCase() !== side
      ) {
        return false;
      }

      if (plan === "yes" && !trade.followed_plan) {
        return false;
      }

      if (plan === "no" && trade.followed_plan) {
        return false;
      }

      const pnl = toNumber(trade.profit_loss);

      if (result === "win" && pnl < 0) {
        return false;
      }

      if (result === "loss" && pnl >= 0) {
        return false;
      }

      return true;
    });
  }, [trades, query, side, plan, result]);

  return (
    <AppShell
      title="معاملات"
      subtitle="مشاهده و مدیریت تمام معاملات ثبت‌شده"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("خروجی CSV به‌زودی آماده می‌شود")
            }
          >
            <Download className="ml-1 h-4 w-4" />
            خروجی
          </Button>

          <Link to="/app/trades/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="ml-1 h-4 w-4" />
              معامله جدید
            </Button>
          </Link>
        </div>
      }
    >
      <div className="card-surface p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نماد..."
            className="max-w-xs bg-secondary/60"
          />

          <Dialog
            open={filterOpen}
            onOpenChange={setFilterOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="ml-1 h-4 w-4" />
                فیلترها
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>فیلتر معاملات</DialogTitle>

                <DialogDescription>
                  معاملات را بر اساس معیارهای زیر فیلتر کن.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>نوع معامله</Label>

                  <Select
                    value={side}
                    onValueChange={(value) =>
                      setSide(
                        value as "all" | "buy" | "sell",
                      )
                    }
                  >
                    <SelectTrigger className="bg-secondary/60">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        همه
                      </SelectItem>

                      <SelectItem value="buy">
                        فقط خرید
                      </SelectItem>

                      <SelectItem value="sell">
                        فقط فروش
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>پایبندی به پلن</Label>

                  <Select
                    value={plan}
                    onValueChange={(value) =>
                      setPlan(
                        value as "all" | "yes" | "no",
                      )
                    }
                  >
                    <SelectTrigger className="bg-secondary/60">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        همه
                      </SelectItem>

                      <SelectItem value="yes">
                        طبق پلن
                      </SelectItem>

                      <SelectItem value="no">
                        خارج از پلن
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>نتیجه</Label>

                  <Select
                    value={result}
                    onValueChange={(value) =>
                      setResult(
                        value as "all" | "win" | "loss",
                      )
                    }
                  >
                    <SelectTrigger className="bg-secondary/60">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">
                        همه
                      </SelectItem>

                      <SelectItem value="win">
                        فقط برنده
                      </SelectItem>

                      <SelectItem value="loss">
                        فقط بازنده
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSide("all");
                    setPlan("all");
                    setResult("all");
                    toast.success("فیلترها پاک شد");
                  }}
                >
                  پاک کردن
                </Button>

                <DialogClose asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    اعمال
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!activePortfolioId && !loading ? (
          <div className="mt-5 rounded-lg border border-border bg-secondary/30 p-8 text-center">
            <p className="font-medium">
              هیچ پرتفولیوی فعالی انتخاب نشده است.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              ابتدا یک پرتفولیو را فعال کنید تا معاملات آن
              نمایش داده شود.
            </p>
          </div>
        ) : loading ? (
          <div className="mt-5 flex min-h-[220px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              در حال دریافت معاملات...
            </div>
          </div>
        ) : error ? (
          <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
            <p className="font-medium text-destructive">
              دریافت معاملات انجام نشد
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            {activePortfolioId && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  void loadTrades(activePortfolioId)
                }
              >
                تلاش مجدد
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-3 text-right font-medium">
                    شناسه
                  </th>

                  <th className="py-3 text-right font-medium">
                    نماد
                  </th>

                  <th className="py-3 text-right font-medium">
                    نوع
                  </th>

                  <th className="py-3 text-right font-medium">
                    ورود
                  </th>

                  <th className="py-3 text-right font-medium">
                    خروج
                  </th>

                  <th className="py-3 text-right font-medium">
                    حجم
                  </th>

                  <th className="py-3 text-right font-medium">
                    R:R
                  </th>

                  <th className="py-3 text-right font-medium">
                    سود/زیان
                  </th>

                  <th className="py-3 text-right font-medium">
                    پلن
                  </th>

                  <th className="py-3 text-right font-medium">
                    تاریخ
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((trade) => {
                  const pnl = toNumber(
                    trade.profit_loss,
                  );

                  const isBuy =
                    trade.transaction_type.toLowerCase() ===
                    "buy";

                  return (
                    <tr
                      key={trade.id}
                      className="border-b border-border/50 hover:bg-secondary/30 last:border-0"
                    >
                      <td className="py-3 text-xs tabular text-muted-foreground">
                        {trade.transaction_id ||
                          trade.id}
                      </td>

                      <td className="py-3 font-medium">
                        {trade.symbol}
                      </td>

                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            isBuy
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-destructive/40 bg-destructive/10 text-destructive"
                          }
                        >
                          {isBuy ? "خرید" : "فروش"}
                        </Badge>
                      </td>

                      <td className="py-3 tabular">
                        {formatPrice(
                          trade.entry_price,
                        )}
                      </td>

                      <td className="py-3 tabular">
                        {formatPrice(
                          trade.exit_price,
                        )}
                      </td>

                      <td className="py-3 tabular">
                        {formatNumber(trade.volume)}
                      </td>

                      <td className="py-3 tabular">
                        {formatNumber(trade.r_r)}
                      </td>

                      <td
                        className={`py-3 tabular font-medium ${
                          pnl >= 0 ? "gain" : "loss"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {pnl.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        $
                      </td>

                      <td className="py-3">
                        {trade.followed_plan ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </td>

                      <td className="py-3 text-xs text-muted-foreground tabular">
                        {formatDate(
                          trade.closed_at ??
                            trade.created_at,
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {trades.length === 0
                  ? "برای این پرتفولیو هنوز معامله‌ای ثبت نشده است."
                  : "هیچ معامله‌ای با فیلترهای انتخاب‌شده پیدا نشد."}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}