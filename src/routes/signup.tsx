// import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
// import { LineChart, ArrowLeft, CheckCircle2 } from "lucide-react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { signup } from "@/api/auth";
// import { getAccessToken } from "@/lib/auth-storage";
// import { toast } from "sonner";

// export const Route = createFileRoute("/signup")({
//   head: () => ({ meta: [{ title: "ثبت‌نام — TraderJournal AI" }] }),
//   component: SignupPage,
// });

// function SignupPage() {
//   const navigate = useNavigate();
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     const parts = fullName.trim().split(/\s+/);
//     const first_name = parts[0] ?? "";
//     const last_name = parts.slice(1).join(" ") || first_name;

//     if (!first_name || !email.trim() || !password) {
//       toast.error("نام، ایمیل و رمز عبور را وارد کنید");
//       return;
//     }

//     try {
//       setLoading(true);
//       await signup({
//         first_name,
//         last_name,
//         email: email.trim(),
//         password,
//       });
//       toast.success("حساب ساخته شد");
//       await navigate({ to: getAccessToken() ? "/app/goals" : "/login" });
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "ثبت‌نام ناموفق بود");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="hero-bg flex min-h-screen items-center justify-center px-4 py-12">
//       <div className="w-full max-w-4xl">
//         <Link to="/" className="mb-8 flex items-center justify-center gap-2">
//           <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
//             <LineChart className="h-5 w-5" />
//           </div>
//           <span className="text-lg font-bold">
//             TraderJournal <span className="text-primary">AI</span>
//           </span>
//         </Link>

//         <div className="card-surface grid overflow-hidden md:grid-cols-2">
//           <div className="border-l border-border bg-secondary/20 p-8">
//             <h2 className="text-lg font-semibold">با پلن رایگان شروع کنید</h2>
//             <p className="mt-2 text-sm text-muted-foreground">همیشه می‌توانید بعداً ارتقا دهید.</p>
//             <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "۱ پرتفولیو رایگان",
//                 "۵۰ معامله در ماه",
//                 "ژورنال کامل",
//                 "آمار پایه",
//                 "بدون نیاز به کارت اعتباری",
//               ].map((f) => (
//                 <li key={f} className="flex items-start gap-2">
//                   <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
//                   <span>{f}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="p-8">
//             <h1 className="text-2xl font-bold">ساخت حساب جدید</h1>
//             <form className="mt-6 space-y-4" onSubmit={submit}>
//               <div className="space-y-2">
//                 <Label htmlFor="name">نام و نام خانوادگی</Label>
//                 <Input
//                   id="name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   placeholder="علی رضایی"
//                   className="bg-secondary/60"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">ایمیل</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="bg-secondary/60"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">رمز عبور</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="حداقل ۸ کاراکتر"
//                   className="bg-secondary/60"
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
//               >
//                 {loading ? "در حال ساخت حساب..." : "ساخت حساب"}
//                 <ArrowLeft className="mr-1 h-4 w-4" />
//               </Button>
//               <p className="text-xs text-muted-foreground">
//                 با ثبت‌نام، قوانین و حریم خصوصی را می‌پذیرید.
//               </p>
//             </form>

//             <div className="mt-6 text-center text-sm text-muted-foreground">
//               حساب دارید؟{" "}
//               <Link to="/login" className="text-primary hover:underline">
//                 وارد شوید
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LineChart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signup } from "@/api/auth";
import { getAccessToken } from "@/lib/auth-storage";
import { setCurrentUser } from "@/lib/current-user";

import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "ثبت‌نام — TraderJournal AI" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const parts = fullName.trim().split(/\s+/);

    const first_name = parts[0] ?? "";
    const last_name = parts.slice(1).join(" ") || first_name;

    if (!first_name || !email.trim() || !password) {
      toast.error("نام، ایمیل و رمز عبور را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      // ثبت نام در API
      await signup({
        first_name,
        last_name,
        email: email.trim(),
        password,
      });

      // ذخیره اسم و فامیل کاربر
      setCurrentUser({
        first_name,
        last_name,
      });

      toast.success("حساب ساخته شد");

      await navigate({
        to: getAccessToken() ? "/app/goals" : "/login",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ثبت‌نام ناموفق بود",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]">
            <LineChart className="h-5 w-5" />
          </div>

          <span className="text-lg font-bold">
            TraderJournal <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="card-surface grid overflow-hidden md:grid-cols-2">
          <div className="border-l border-border bg-secondary/20 p-8">
            <h2 className="text-lg font-semibold">
              با پلن رایگان شروع کنید
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              همیشه می‌توانید بعداً ارتقا دهید.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              {[
                "۱ پرتفولیو رایگان",
                "۵۰ معامله در ماه",
                "ژورنال کامل",
                "آمار پایه",
                "بدون نیاز به کارت اعتباری",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-bold">
              ساخت حساب جدید
            </h1>

            <form
              className="mt-6 space-y-4"
              onSubmit={submit}
            >
              <div className="space-y-2">
                <Label htmlFor="name">
                  نام و نام خانوادگی
                </Label>

                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="علی رضایی"
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  ایمیل
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="bg-secondary/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  رمز عبور
                </Label>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="حداقل ۸ کاراکتر"
                  className="bg-secondary/60"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading
                  ? "در حال ساخت حساب..."
                  : "ساخت حساب"}

                <ArrowLeft className="mr-1 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground">
                با ثبت‌نام، قوانین و حریم خصوصی را می‌پذیرید.
              </p>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              حساب دارید؟{" "}
              <Link
                to="/login"
                className="text-primary hover:underline"
              >
                وارد شوید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
