import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { getTrades, Trade } from "@/api/trades";
import { ImportTradesModal } from "@/components/ImportTradesModal";

export const Route = createFileRoute("/app/trades")({
  head: () => ({ meta: [{ title: "معاملات" }] }),
  component: TradesLayout,
});

function TradesLayout() {
  const location = useLocation();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // بررسی اینکه آیا کاربر در مسیر ثبت معامله جدید قرار دارد یا خیر
  const isNewTradePage = location.pathname.endsWith("/new");

  const fetchTradesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTrades(1);
      setTrades(res.results.transactions);
    } catch (err: any) {
      setError(err.message || "خطا در دریافت لیست معاملات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNewTradePage) {
      fetchTradesList();
    }
  }, [location.pathname]);

  // اگر کاربر روی دکمه "+ معامله جدید" زده بود، فرم فرزند را نشان بده
  if (isNewTradePage) {
    return <Outlet />;
  }

  return (
    <AppShell title="لیست معاملات" subtitle="مدیریت و مشاهده تمام معاملات ثبت شده">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">معاملات شما</h2>
        <div className="flex gap-2">
          <ImportTradesModal />
          <Button variant="outline" size="icon" onClick={fetchTradesList} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link to="/app/trades/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              معامله جدید
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="card-surface flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="card-surface p-6 text-center text-red-500">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchTradesList}>
            تلاش مجدد
          </Button>
        </div>
      ) : trades.length === 0 ? (
        <div className="card-surface p-8 text-center text-muted-foreground">
          هیچ معامله‌ای پیدا نشد. برای ثبت اولین معامله روی دکمه بالا کلیک کنید.
        </div>
      ) : (
        <div className="card-surface overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">نماد</th>
                  <th className="p-4 font-medium">نوع</th>
                  <th className="p-4 font-medium">حجم</th>
                  <th className="p-4 font-medium">قیمت ورود</th>
                  <th className="p-4 font-medium">قیمت خروج</th>
                  <th className="p-4 font-medium">تضمین/R:R</th>
                  <th className="p-4 font-medium">سود / زیان</th>
                  <th className="p-4 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {trades.map((trade) => {
                  const isBuy = trade.transaction_type.toLowerCase() === "buy";
                  const pnl = typeof trade.profit_loss === "number" ? trade.profit_loss : parseFloat(String(trade.profit_loss || 0));
                  const isProfit = pnl >= 0;
                  return (
                    <tr key={trade.id} className="transition-colors hover:bg-muted/30">
                      <td className="p-4 font-bold tabular">{trade.symbol}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${
                            isBuy
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {isBuy ? "خرید (BUY)" : "فروش (SELL)"}
                        </span>
                      </td>
                      <td className="p-4 tabular text-muted-foreground">{trade.volume}</td>
                      <td className="p-4 tabular">{trade.entry_price}</td>
                      <td className="p-4 tabular">{trade.exit_price ?? "-"}</td>
                      <td className="p-4 tabular text-muted-foreground">{trade.risk_reward ?? trade.r_r ?? "-"}</td>
                      <td className={`p-4 tabular font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                        {isProfit ? `+$${pnl}` : `-$${Math.abs(pnl)}`}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground tabular">
                        {trade.closed_at ? new Date(trade.closed_at).toLocaleDateString("fa-IR") : (trade.created_at ? new Date(trade.created_at).toLocaleDateString("fa-IR") : "-")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
