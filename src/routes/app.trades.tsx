import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { getTrades, Trade } from "@/api/trades";

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
        <div className="grid gap-4">
          {trades.map((trade) => (
            <div key={trade.id} className="card-surface flex items-center justify-between p-4">
              <div>
                <span className="font-bold">{trade.symbol}</span>
                <span
                  className={`mr-2 rounded px-2 py-0.5 text-xs font-semibold ${
                    trade.transaction_type.toLowerCase() === "buy"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {trade.transaction_type.toUpperCase()}
                </span>
              </div>
              <div className="text-sm tabular text-muted-foreground">
                ورود: {trade.entry_price} | خروج: {trade.exit_price}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}