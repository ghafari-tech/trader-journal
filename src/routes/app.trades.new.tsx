import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Textarea may not exist; if not we'll create a simple wrapper.
export const Route = createFileRoute("/app/trades/new")({
  head: () => ({ meta: [{ title: "معامله جدید" }] }),
  component: NewTrade,
});

function NewTrade() {
  return (
    <AppShell title="ثبت معامله جدید" subtitle="اطلاعات معامله و ژورنال آن را وارد کنید">
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface space-y-4 p-6 lg:col-span-2">
          <h3 className="font-semibold">اطلاعات معامله</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>نماد</Label>
              <Input placeholder="EURUSD" className="bg-secondary/60" />
            </div>
            <div className="space-y-2">
              <Label>نوع معامله</Label>
              <Select>
                <SelectTrigger className="bg-secondary/60"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">خرید (Buy)</SelectItem>
                  <SelectItem value="sell">فروش (Sell)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>قیمت ورود</Label>
              <Input type="number" step="0.0001" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>قیمت خروج</Label>
              <Input type="number" step="0.0001" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>Stop Loss</Label>
              <Input type="number" step="0.0001" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>Take Profit</Label>
              <Input type="number" step="0.0001" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>حجم معامله (Lot)</Label>
              <Input type="number" step="0.01" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>میزان ریسک (٪)</Label>
              <Input type="number" step="0.1" placeholder="۱" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>کمیسیون ($)</Label>
              <Input type="number" step="0.01" className="bg-secondary/60 tabular" />
            </div>
            <div className="space-y-2">
              <Label>سواپ ($)</Label>
              <Input type="number" step="0.01" className="bg-secondary/60 tabular" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>تصویر معامله</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
              <div>
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">اسکرین‌شات چارت را بکشید یا انتخاب کنید</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>توضیحات</Label>
            <Textarea rows={3} placeholder="توضیحات کلی درباره معامله..." className="bg-secondary/60" />
          </div>
        </div>

        <div className="card-surface space-y-4 p-6">
          <h3 className="font-semibold">ژورنال معامله</h3>

          <div className="space-y-2">
            <Label>دلیل ورود</Label>
            <Textarea rows={2} placeholder="سیگنال، ست‌آپ، تحلیل..." className="bg-secondary/60" />
          </div>
          <div className="space-y-2">
            <Label>دلیل خروج</Label>
            <Textarea rows={2} placeholder="تحقق تارگت، شکست ست‌آپ..." className="bg-secondary/60" />
          </div>
          <div className="space-y-2">
            <Label>احساس قبل از ورود</Label>
            <Select>
              <SelectTrigger className="bg-secondary/60"><SelectValue placeholder="انتخاب" /></SelectTrigger>
              <SelectContent>
                {["آرام", "متمرکز", "مضطرب", "طمع", "ترس", "انتقام"].map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>احساس بعد از خروج</Label>
            <Select>
              <SelectTrigger className="bg-secondary/60"><SelectValue placeholder="انتخاب" /></SelectTrigger>
              <SelectContent>
                {["رضایت", "پشیمانی", "بی‌تفاوت", "هیجان", "خشم"].map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
            <div>
              <div className="text-sm font-medium">طبق پلن معامله شد؟</div>
              <div className="text-xs text-muted-foreground">پایبندی به قوانین</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>اشتباهات</Label>
            <Textarea rows={2} placeholder="چه اشتباهاتی مرتکب شدی؟" className="bg-secondary/60" />
          </div>
          <div className="space-y-2">
            <Label>درس آموخته‌شده</Label>
            <Textarea rows={2} placeholder="چه یاد گرفتی؟" className="bg-secondary/60" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              ثبت معامله <ArrowRight className="mr-1 h-4 w-4" />
            </Button>
            <Button variant="outline">انصراف</Button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
