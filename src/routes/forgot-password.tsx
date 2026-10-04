import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LineChart, KeyRound, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "فراموشی رمز عبور — TraderJournal AI" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // آدرس HTTPS دقیق سرور
  const BASE_URL = "https://trade.piqagram.ir";

  // گام ۱: درخواست ارسال کد بازیابی به ایمیل
  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("لطفاً ایمیل خود را وارد کنید");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json().catch(() => null)) as {
        message?: string;
        detail?: string;
      } | null;

      if (res.ok) {
        toast.success(data?.message || "کد بازیابی به ایمیل شما ارسال شد");
        setStep(2);
      } else {
        toast.error(
          data?.detail || data?.message || "کاربری با این ایمیل یافت نشد"
        );
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  // گام ۲: تایید کد و تغییر رمز عبور
  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim() || !newPassword || !confirmPassword) {
      toast.error("لطفاً تمامی فیلدها را پر کنید");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور جدید و تکرار آن یکسان نیستند");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          new_password: newPassword,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        message?: string;
        detail?: string;
      } | null;

      if (res.ok) {
        toast.success(data?.message || "رمز عبور با موفقیت تغییر یافت");
        await navigate({ to: "/login" });
      } else {
        toast.error(
          data?.detail || data?.message || "کد وارد شده اشتباه یا منقضی شده است"
        );
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
            <LineChart className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">
            TraderJournal <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="card-surface p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">بازیابی رمز عبور</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {step === 1 ? "ایمیل خود را وارد کنید" : "کد تایید و رمز جدید را وارد کنید"}
              </p>
            </div>
          </div>

          {step === 1 ? (
            <form className="mt-6 space-y-4" onSubmit={handleSendCode}>
              <div className="space-y-2 text-right">
                <Label htmlFor="email">ایمیل</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-secondary/60 pl-10 text-left dir-ltr"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "در حال ارسال..." : "ارسال کد بازیابی"}
                <ArrowLeft className="mr-1 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
              <div className="space-y-2 text-right">
                <Label htmlFor="code">کد تایید ارسال‌شده</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                  placeholder="کد ۶ رقمی"
                  className="bg-secondary/60 text-center tracking-widest"
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="newPassword">رمز عبور جدید</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary/60 dir-ltr"
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary/60 dir-ltr"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3"
                >
                  ویرایش ایمیل
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            رمز عبور خود را به یاد دارید؟{" "}
            <Link to="/login" className="text-primary hover:underline inline-flex items-center gap-1">
              ورود به حساب
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}