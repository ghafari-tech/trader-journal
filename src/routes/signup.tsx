import { Link, createFileRoute } from "@tanstack/react-router";
import { LineChart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "ثبت‌نام — TraderJournal AI" }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
            <LineChart className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">TraderJournal <span className="text-primary">AI</span></span>
        </Link>

        <div className="card-surface grid overflow-hidden md:grid-cols-2">
          <div className="border-l border-border bg-secondary/20 p-8">
            <h2 className="text-lg font-semibold">با پلن رایگان شروع کنید</h2>
            <p className="mt-2 text-sm text-muted-foreground">همیشه می‌توانید بعداً ارتقا دهید.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "۱ پرتفولیو رایگان",
                "۵۰ معامله در ماه",
                "ژورنال کامل",
                "آمار پایه",
                "بدون نیاز به کارت اعتباری",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-bold">ساخت حساب جدید</h1>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input id="name" placeholder="علی رضایی" className="bg-secondary/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="bg-secondary/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input id="password" type="password" placeholder="حداقل ۸ کاراکتر" className="bg-secondary/60" />
              </div>
              <Link to="/app/dashboard">
                <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  ساخت حساب
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                با ثبت‌نام، قوانین و حریم خصوصی را می‌پذیرید.
              </p>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              حساب دارید؟{" "}
              <Link to="/login" className="text-primary hover:underline">
                وارد شوید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
