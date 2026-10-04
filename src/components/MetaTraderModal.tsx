import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Download,
  RefreshCw,
  Check,
  AlertCircle,
  CheckCircle2,
  Server,
  UserCheck,
} from "lucide-react";

interface MTStatusResponse {
  connected: boolean;
  platform: string | null;
  server: string | null;
  account_number: string | null;
  api_key: string | null;
  last_seen: string | null;
}

export const MetaTraderModal: React.FC = () => {
  const [status, setStatus] = useState<MTStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const BASE_URL = "http://trade.piqagram.ir";

  // تابع برای دریافت توکن احراز هویت از ذخیره‌ساز محلی
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("access_token") || "";
  };

  // ۱. دریافت وضعیت متاتریدر و API Key از بک‌اند
  const fetchMTStatus = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/app/settings/metatrader/mt-status/`, {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: MTStatusResponse = await res.json();
        setStatus(data);
      } else {
        console.error("خطا در دریافت وضعیت:", res.status);
      }
    } catch (err) {
      console.error("خطا در ارتباط با سرور:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMTStatus();
  }, []);

  // کپی کردن API Key
  const handleCopyKey = () => {
    if (status?.api_key) {
      void navigator.clipboard.writeText(status.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ۲. دانلود اکسپرت TradeJournalEA.ex5 همراه با توکن
  const handleDownloadEA = async () => {
    setDownloading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/app/settings/metatrader/download-ea/`, {
        method: "GET",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("خطا در دانلود فایل");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TradeJournalEA.ex5";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("خطا در دانلود اکسپرت:", err);
      alert("خطا در دانلود فایل اکسپرت. مطمئن شوید که وارد حساب کاربری شده‌اید.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>اتصال به MetaTrader 5</span>
          {status?.connected ? (
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] text-right" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>اتصال MetaTrader 5</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchMTStatus}
              disabled={loading}
              className="h-7 w-7"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            حساب MetaTrader 5 خود را متصل کنید تا معاملات شما به‌صورت خودکار همگام‌سازی شوند.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-3">
          {/* نمایش وضعیت اتصال */}
          <div className="p-4 rounded-lg border bg-secondary/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">وضعیت اتصال:</span>
              {status?.connected ? (
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 gap-1.5 py-1 px-3">
                  <CheckCircle2 className="h-4 w-4" />
                  متصل (Connected)
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1.5 py-1 px-3">
                  <AlertCircle className="h-4 w-4" />
                  قطع ارتباط (Disconnected)
                </Badge>
              )}
            </div>

            {/* جزئیات حساب در صورت متصل بودن */}
            {status?.connected && (
              <div className="pt-2 text-xs text-muted-foreground space-y-1 border-t border-border mt-2">
                {status.account_number && (
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>شماره حساب: {status.account_number}</span>
                  </div>
                )}
                {status.server && (
                  <div className="flex items-center gap-1">
                    <Server className="h-3.5 w-3.5" />
                    <span>سرور: {status.server}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* کلید اختصاصی API Key */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              API Key اختصاصی شما:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={status?.api_key || "در حال دریافت..."}
                className="w-full bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-sm font-mono text-left dir-ltr selection:bg-primary/20"
              />
              <Button
                variant="secondary"
                onClick={handleCopyKey}
                disabled={!status?.api_key}
                className="gap-1.5 shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "کپی شد" : "Copy"}
              </Button>
            </div>
          </div>

          {/* دکمه دانلود اکسپرت */}
          <div className="pt-2">
            <Button
              onClick={handleDownloadEA}
              disabled={downloading}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              {downloading ? "در حال دانلود..." : "Download MetaTrader 5 EA (TradeJournalEA.ex5)"}
            </Button>
          </div>

          {/* راهنمای نصب */}
          <div className="text-xs text-muted-foreground space-y-2 bg-secondary/30 p-3.5 rounded-lg border border-border">
            <p className="font-semibold text-foreground">راهنمای نصب TradeJournal EA در MT5:</p>
            <ol className="list-decimal list-inside space-y-1 pr-1 leading-relaxed">
              <li>فایل <code className="text-xs bg-muted px-1 rounded">TradeJournalEA.ex5</code> را دانلود کنید.</li>
              <li>در MetaTrader 5 به مسیر <code className="text-xs bg-muted px-1 rounded">File → Open Data Folder</code> بروید.</li>
              <li>پوشه <code className="text-xs bg-muted px-1 rounded">MQL5 → Experts</code> را باز کنید.</li>
              <li>فایل <code className="text-xs bg-muted px-1 rounded">TradeJournalEA.ex5</code> را قرار دهید.</li>
              <li>در پنل Navigator روی Expert Advisors راست‌کلیک کرده و **Refresh** را بزنید.</li>
              <li>اکسپرت را روی یک Chart بکشید و **API Key** بالا را در تنظیمات آن وارد کنید.</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};