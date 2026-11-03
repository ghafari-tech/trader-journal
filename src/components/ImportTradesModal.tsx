import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getAccessToken } from "@/lib/auth-storage";
import { getPortfolios, Portfolio } from "@/api/portfolio";

export const ImportTradesModal: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("");

  useEffect(() => {
    getPortfolios()
      .then((data) => {
        if (data && data.length > 0) {
          setPortfolios(data);
          const activeId = localStorage.getItem("active_portfolio_id") || String(data[0].id);
          setSelectedPortfolioId(activeId);
        }
      })
      .catch((err) => {
        console.error("خطا در دریافت پورتفوی‌ها:", err);
      });
  }, []);

  const getAuthToken = (): string | null => {
    const rawToken = getAccessToken();
    if (!rawToken) return null;
    if (rawToken.startsWith("Bearer ")) {
      return rawToken;
    }
    return `Bearer ${rawToken}`;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  };

  const handleImport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    if (!selectedPortfolioId) {
      setErrorMsg("لطفاً یک پورتفوی انتخاب کنید.");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setErrorMsg("نشست کاربری شما منقضی شده است. لطفاً دوباره وارد سیستم شوید.");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("portfolio_id", selectedPortfolioId);

      const response = await fetch("/backend/app/trades/add/import/", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccessMsg("فایل معاملات با موفقیت بارگذاری و ایمپورت شد.");
        setFile(null);
      } else {
        const errorData = (await response.json().catch(() => null)) as {
          detail?: string;
          message?: string;
        } | null;
        setErrorMsg(
          errorData?.detail || errorData?.message || "خطا در بارگذاری فایل. لطفا فرمت فایل را بررسی کنید."
        );
      }
    } catch (err) {
      console.error("خطا در ارسال فایل:", err);
      setErrorMsg("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          <span>ایمپورت معاملات</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold">
            ایمپورت فایل معاملات
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            فایل خروجی معاملات خود (CSV یا Excel) را جهت افزودن به ژورنال بارگذاری کنید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleImport} className="space-y-4 mt-4 text-right">
          {portfolios.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                انتخاب پورتفوی مقصد:
              </label>
              <select
                value={selectedPortfolioId}
                onChange={(e) => setSelectedPortfolioId(e.target.value)}
                className="w-full p-2 text-sm bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.broker})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="border-2 border-dashed border-border hover:border-emerald-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-secondary/30">
            <input
              type="file"
              accept=".csv, .xlsx, .xls, .html"
              onChange={handleFileChange}
              className="hidden"
              id="trade-file-input"
            />
            <label htmlFor="trade-file-input" className="cursor-pointer space-y-2 block">
              <div className="flex justify-center text-emerald-500 mb-2">
                {file ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                ) : (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="text-sm font-medium">
                {file ? file.name : "برای انتخاب فایل اینجا کلیک کنید"}
              </div>
              <div className="text-xs text-muted-foreground">
                فرمت‌های پشتیبانی شده: CSV, XLSX, HTML
              </div>
            </label>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-md text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={!file || isUploading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 disabled:opacity-50"
          >
            {isUploading ? "در حال بارگذاری..." : "شروع ایمپورت"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
