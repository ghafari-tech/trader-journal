import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, User, Bell, Link2, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "تنظیمات" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="تنظیمات" subtitle="مدیریت حساب، اشتراک و اتصالات">
      <Tabs defaultValue="profile" dir="rtl">
        <TabsList>
          <TabsTrigger value="profile"><User className="ml-1 h-4 w-4" />پروفایل</TabsTrigger>
          <TabsTrigger value="subscription"><CreditCard className="ml-1 h-4 w-4" />اشتراک</TabsTrigger>
          <TabsTrigger value="mt"><Link2 className="ml-1 h-4 w-4" />متاتریدر</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="ml-1 h-4 w-4" />اعلان‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="card-surface p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/20 text-lg font-bold text-primary">ع.ر</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">علی رضایی</div>
                <div className="text-sm text-muted-foreground">ali@example.com</div>
              </div>
              <Button variant="outline" className="mr-auto">تغییر عکس</Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>نام</Label><Input defaultValue="علی" className="bg-secondary/60" /></div>
              <div className="space-y-2"><Label>نام خانوادگی</Label><Input defaultValue="رضایی" className="bg-secondary/60" /></div>
              <div className="space-y-2"><Label>ایمیل</Label><Input defaultValue="ali@example.com" className="bg-secondary/60" /></div>
              <div className="space-y-2"><Label>موبایل</Label><Input defaultValue="09123456789" className="bg-secondary/60 tabular" /></div>
            </div>
            <div className="mt-6"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">ذخیره تغییرات</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card-surface p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">اشتراک فعلی</div>
                  <div className="mt-1 text-2xl font-bold">Pro Max</div>
                </div>
                <Badge className="bg-primary text-primary-foreground">فعال</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
                <div><div className="text-muted-foreground">شروع</div><div className="mt-1 tabular">۱۴۰۳/۰۷/۰۱</div></div>
                <div><div className="text-muted-foreground">پایان</div><div className="mt-1 tabular">۱۴۰۳/۰۸/۰۱</div></div>
                <div><div className="text-muted-foreground">مبلغ ماهانه</div><div className="mt-1 tabular">۲,۰۰۰,۰۰۰ تومان</div></div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">تمدید اشتراک</Button>
                <Button variant="outline">مشاهده فاکتورها</Button>
              </div>
            </div>
            <div className="card-surface p-6">
              <div className="font-semibold">کد تخفیف</div>
              <div className="mt-3 flex gap-2">
                <Input placeholder="کد را وارد کنید" className="bg-secondary/60" />
                <Button variant="outline">اعمال</Button>
              </div>
              <div className="mt-4 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <CheckCircle2 className="ml-1 inline h-4 w-4" />
                پرداخت از طریق زرین‌پال
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mt" className="mt-6">
          <div className="card-surface p-6">
            <h3 className="font-semibold">اتصال حساب متاتریدر</h3>
            <p className="mt-1 text-sm text-muted-foreground">معاملات از MT4/MT5 به‌صورت خودکار همگام می‌شوند.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>نسخه</Label><Input defaultValue="MT5" className="bg-secondary/60" /></div>
              <div className="space-y-2"><Label>سرور</Label><Input placeholder="ICMarkets-Live01" className="bg-secondary/60" /></div>
              <div className="space-y-2"><Label>شماره حساب</Label><Input placeholder="12345678" className="bg-secondary/60 tabular" /></div>
              <div className="space-y-2"><Label>رمز Investor</Label><Input type="password" className="bg-secondary/60" /></div>
            </div>
            <div className="mt-6"><Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Link2 className="ml-1 h-4 w-4" />اتصال</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="card-surface space-y-4 p-6">
            {[
              { t: "یادآوری ثبت ژورنال", d: "شب‌ها اگر ژورنال ثبت نشده باشد یادآوری کن." },
              { t: "هشدار نزدیک شدن به سقف ریسک", d: "وقتی ۸۰٪ ضرر روزانه رخ داد." },
              { t: "گزارش هفتگی AI", d: "خلاصه عملکرد هفتگی به ایمیل ارسال شود." },
              { t: "رفتار غیرعادی معاملاتی", d: "شناسایی FOMO یا Revenge Trading." },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
                <div>
                  <div className="font-medium">{n.t}</div>
                  <div className="text-xs text-muted-foreground">{n.d}</div>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
