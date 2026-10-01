import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { FileSpreadsheet, Link2, RefreshCw, Upload } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/trades/new")({
  head: () => ({
    meta: [{ title: "افزودن معامله — ایمپورت یا اتصال" }],
  }),
  component: NewTrade,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const portfolios = [
  { value: "main", label: "پرتفولیوی اصلی" },
  { value: "prop", label: "حساب پراپ" },
  { value: "demo", label: "حساب دمو" },
] as const;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function acceptFile(file: File | undefined, onSelect: (file: File) => void) {
  if (!file) return;

  const allowed = /\.(csv|html|htm|xlsx)$/i.test(file.name);
  if (!allowed) {
    toast.error("فقط فایل‌های CSV، HTML یا XLSX قبول می‌شوند.");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.");
    return;
  }

  onSelect(file);
  toast.success(`فایل ${file.name} انتخاب شد.`);
}

export function NewTrade() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<"file" | "metatrader">("file");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePortfolio, setFilePortfolio] = useState<string>("");
  const [fileMtVersion, setFileMtVersion] = useState<string>("MT5");

  const [mtVersion, setMtVersion] = useState<string>("MT5");
  const [broker, setBroker] = useState("");
  const [server, setServer] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mtPortfolio, setMtPortfolio] = useState("");

  function handleFileImportSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("لطفاً ابتدا یک فایل انتخاب کنید.");
      return;
    }
    if (!filePortfolio) {
      toast.error("پرتفولیو مقصد را انتخاب کنید.");
      return;
    }
    toast.success("فایل آماده ایمپورت است. اتصال API در مرحله بعد اضافه می‌شود.");
  }

  function handleMtConnectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!broker.trim() || !server.trim() || !accountNumber.trim()) {
      toast.error("بروکر، سرور و شماره حساب را کامل کنید.");
      return;
    }
    if (!mtPortfolio) {
      toast.error("پرتفولیو مقصد را انتخاب کنید.");
      return;
    }
    toast.success("فرم اتصال متاتریدر آماده است. اتصال API در مرحله بعد اضافه می‌شود.");
  }

  return (
    <AppShell
      title="افزودن معامله — ایمپورت یا اتصال"
      subtitle="گزارش معاملات خود را ایمپورت کنید یا حساب متاتریدر متصل بسازید"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-end">
          <div className="inline-flex rounded-xl border border-border bg-secondary/50 p-1">
            <TabButton
              active={activeTab === "metatrader"}
              onClick={() => setActiveTab("metatrader")}
              icon={<Link2 className="h-4 w-4" />}
              label="اتصال متاتریدر"
            />
            <TabButton
              active={activeTab === "file"}
              onClick={() => setActiveTab("file")}
              icon={<FileSpreadsheet className="h-4 w-4" />}
              label="ایمپورت فایل"
            />
          </div>
        </div>

        {activeTab === "file" && (
          <div className="space-y-6">
            <form onSubmit={handleFileImportSubmit} className="card-surface space-y-6 p-6">
              <div className="space-y-2 text-center">
                <div className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">ایمپورت گزارش معاملات</h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                  از متاتریدر خروجی{" "}
                  <span className="font-medium text-foreground">History / Report</span> بگیرید و
                  فایل را اینجا بارگذاری کن. تمام فیلدها (Ticket, Symbol, Volume, Swap, Commission و...)
                  به‌صورت خودکار خوانده می‌شوند.
                </p>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  acceptFile(e.dataTransfer.files?.[0], setSelectedFile);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 p-8 text-center transition-all hover:border-primary/50 hover:bg-secondary/70"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.html,.htm,.xlsx"
                  onChange={(e) => acceptFile(e.target.files?.[0], setSelectedFile)}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-hover:scale-110">
                  <Upload className="h-6 w-6" />
                </div>

                {selectedFile ? (
                  <div className="mt-4 space-y-1">
                    <p className="max-w-xs truncate text-sm font-semibold text-primary">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-semibold">فایل را بکش و رها کن یا کلیک کن</p>
                    <p className="text-xs text-muted-foreground">
                      CSV, HTML, XLSX — حداکثر ۱۰ مگابایت
                    </p>
                  </div>
                )}
              </div>

              <Field label="پرتفولیو مقصد">
                <Select value={filePortfolio || undefined} onValueChange={setFilePortfolio}>
                  <SelectTrigger className="h-11 w-full bg-secondary/60">
                    <SelectValue placeholder="انتخاب پرتفولیو" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="نسخه متاتریدر">
                <Select value={fileMtVersion} onValueChange={setFileMtVersion}>
                  <SelectTrigger className="h-11 w-full bg-secondary/60">
                    <SelectValue placeholder="انتخاب نسخه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MT5">MT5</SelectItem>
                    <SelectItem value="MT4">MT4</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                  type="submit"
                  className="h-11 flex-1 rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="ml-2 h-4 w-4" />
                  شروع ایمپورت
                </Button>

                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="h-11 rounded-xl px-6"
                  >
                    پاک کردن
                  </Button>
                )}
              </div>
            </form>

            <div className="card-surface space-y-4 p-6">
              <h3 className="text-base font-bold">راهنمای خروجی گرفتن</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {[
                  <>
                    در متاتریدر به تب <span className="font-medium text-foreground">History</span> برو.
                  </>,
                  <>بازه زمانی دلخواه را انتخاب کن.</>,
                  <>
                    راست‌کلیک ← <span className="font-medium text-foreground">Report</span> ← گزینه{" "}
                    <span className="font-medium text-foreground">HTML</span> یا{" "}
                    <span className="font-medium text-foreground">XLSX</span>.
                  </>,
                  <>فایل ذخیره‌شده را اینجا بارگذاری کن.</>,
                ].map((step, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {activeTab === "metatrader" && (
          <form onSubmit={handleMtConnectSubmit} className="card-surface space-y-5 p-6">
            <div className="space-y-2 text-center">
              <div className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Link2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">اتصال حساب متاتریدر</h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                معاملات بسته‌شده با نصب یک EA (اکسپرت) به‌صورت خودکار همگام می‌شوند.
              </p>
            </div>

            <Field label="نسخه">
              <Select value={mtVersion} onValueChange={setMtVersion}>
                <SelectTrigger className="h-11 w-full bg-secondary/60">
                  <SelectValue placeholder="انتخاب نسخه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MT5">MT5</SelectItem>
                  <SelectItem value="MT4">MT4</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="بروکر">
              <Input
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                placeholder="مثلاً IC Markets"
                className="h-11 bg-secondary/60"
              />
            </Field>

            <Field label="سرور">
              <Input
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="مثلاً ICMarkets-Live01"
                className="h-11 bg-secondary/60"
              />
            </Field>

            <Field label="شماره حساب">
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="12345678"
                dir="ltr"
                className="h-11 bg-secondary/60 text-right"
              />
            </Field>

            <Field label="پرتفولیو مقصد">
              <Select value={mtPortfolio || undefined} onValueChange={setMtPortfolio}>
                <SelectTrigger className="h-11 w-full bg-secondary/60">
                  <SelectValue placeholder="انتخاب پرتفولیو" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="pt-2">
              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="ml-2 h-4 w-4" />
                اتصال
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
