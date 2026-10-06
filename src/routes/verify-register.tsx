
import {
  Link,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  LineChart,
  ArrowLeft,
  MailCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { verifyRegister } from "@/api/auth";

import { toast } from "sonner";

export const Route =
  createFileRoute("/verify-register")({
    validateSearch: (
      search: Record<string, unknown>,
    ) => ({
      email:
        typeof search.email === "string"
          ? search.email
          : "",
    }),

    head: () => ({
      meta: [
        {
          title:
            "تأیید ایمیل — TraderJournal AI",
        },
      ],
    }),

    component:
      VerifyRegisterPage,
  });

function VerifyRegisterPage() {
  const navigate = useNavigate();

  const { email } =
    Route.useSearch();

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!email) {
      toast.error(
        "ایمیل ثبت‌نام پیدا نشد",
      );

      navigate({
        to: "/signup",
        replace: true,
      });
    }
  }, [email, navigate]);

  async function submit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const cleanCode =
      code.trim();

    if (!email) {
      toast.error(
        "ایمیل ثبت‌نام پیدا نشد",
      );
      return;
    }

    if (!cleanCode) {
      toast.error(
        "کد تأیید را وارد کنید",
      );
      return;
    }

    try {
      setLoading(true);

      await verifyRegister(
        email,
        cleanCode,
      );

      toast.success(
        "ایمیل با موفقیت تأیید شد",
      );

      /*
       * API بعد از تأیید می‌گوید:
       * Please login.
       *
       * بنابراین کاربر را به Login می‌فرستیم.
       */
      await navigate({
        to: "/login",
        search: {
          email,
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "کد تأیید صحیح نیست",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(
    value: string,
  ) {
    /*
     * فقط عدد قبول می‌کنیم.
     * کد تست‌شده API هم ۶ رقمی بود.
     */
    const numericValue =
      value
        .replace(/\D/g, "")
        .slice(0, 6);

    setCode(numericValue);
  }

  if (!email) {
    return null;
  }

  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
            <LineChart className="h-5 w-5" />
          </div>

          <span className="text-lg font-bold">
            TraderJournal{" "}
            <span className="text-primary">
              AI
            </span>
          </span>
        </Link>

        <div className="card-surface p-8">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              تأیید ایمیل
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              یک کد تأیید به ایمیل زیر ارسال کردیم:
            </p>

            <p
              className="mt-2 max-w-full break-all text-sm font-medium"
              dir="ltr"
            >
              {email}
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={submit}
          >
            <div className="space-y-2">
              <Label htmlFor="verification-code">
                کد تأیید
              </Label>

              <Input
                id="verification-code"
                value={code}
                onChange={(e) =>
                  handleCodeChange(
                    e.target.value,
                  )
                }
                placeholder="کد ۶ رقمی"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="bg-secondary/60 text-center text-xl tracking-[0.5em]"
                dir="ltr"
                autoFocus
              />

              <p className="text-xs text-muted-foreground">
                کد ارسال‌شده به ایمیل را وارد کنید.
              </p>
            </div>

            <Button
              type="submit"
              disabled={
                loading ||
                code.length === 0
              }
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading
                ? "در حال بررسی..."
                : "تأیید ایمیل"}

              <ArrowLeft className="mr-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ایمیل اشتباه است؟{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline"
            >
              بازگشت به ثبت‌نام
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

