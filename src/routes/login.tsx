import { Link, createFileRoute } from "@tanstack/react-router";
import { LineChart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "ورود — TraderJournal AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
            <LineChart className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">TraderJournal <span className="text-primary">AI</span></span>
        </Link>

        <div className="card-surface p-8">
          <h1 className="text-2xl font-bold">ورود به حساب</h1>
          <p className="mt-1 text-sm text-muted-foreground">اطلاعات حساب خود را وارد کنید.</p>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="bg-secondary/60" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">رمز عبور</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  فراموشی رمز؟
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="bg-secondary/60" />
            </div>
            <Link to="/app/dashboard">
              <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                ورود
                <ArrowLeft className="mr-1 h-4 w-4" />
              </Button>
            </Link>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            حساب ندارید؟{" "}
            <Link to="/signup" className="text-primary hover:underline">
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
