import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Upload, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createTrade } from "@/api/trades";

export const Route = createFileRoute("/app/trades/new")({
  head: () => ({ meta: [{ title: "معامله جدید" }] }),
  component: NewTrade,
});

function NewTrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    symbol: "",
    transaction_type: "buy",
    entry_price: "",
    exit_price: "",
    stop_loss: "",
    take_profit: "",
    volume: "",
    risk_percent: "1",
    commission: "",
    swap: "",
    notes: "",
    entry_reason: "",
    exit_reason: "",
    emotion_before: "",
    emotion_after: "",
    followed_plan: true,
    mistakes: "",
    lessons: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await createTrade({
        ...formData,
        chart_image: file,
      });
      navigate({ to: "/app/trades" });
    } catch (err: any) {
      setErrorMessage(err.message || "خطا در ثبت معامله");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="ثبت معامله جدید" subtitle="اطلاعات معامله و ژورنال آن را وارد کنید">
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {errorMessage && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-500 lg:col-span-3 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="card-surface space-y-4 p-6 lg:col-span-2">
          <h3 className="font-semibold">اطلاعات معامله</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>نماد</Label>
              <Input
                placeholder="EURUSD"
                value={formData.symbol}
                onChange={(e) => handleChange("symbol", e.target.value)}
                className="bg-secondary/60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>نوع معامله</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(val) => handleChange("transaction_type", val)}
              >
                <SelectTrigger className="bg-secondary/60">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">خرید (Buy)</SelectItem>
                  <SelectItem value="sell">فروش (Sell)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>قیمت ورود</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.entry_price}
                onChange={(e) => handleChange("entry_price", e.target.value)}
                className="bg-secondary/60 tabular"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>قیمت خروج</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.exit_price}
                onChange={(e) => handleChange("exit_price", e.target.value)}
                className="bg-secondary/60 tabular"
              />
            </div>
            <div className="space-y-2">
              <Label>Stop Loss</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.stop_loss}
                onChange={(e) => handleChange("stop_loss", e.target.value)}
                className="bg-secondary/60 tabular"
              />
            </div>
            <div className="space-y-2">
              <Label>Take Profit</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.take_profit}
                onChange={(e) => handleChange("take_profit", e.target.value)}
                className="bg-secondary/60 tabular"
              />
            </div>
            <div className="space-y-2">
              <Label>حجم معامله (Lot)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
                className="bg-secondary/60 tabular"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>میزان ریسک (٪)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="۱"
                value={formData.risk_percent}
                onChange={(e) => handleChange("risk_percent", e.target.value)}
                className="bg-secondary/60 tabular"
              />
            </div>
            <div className="space-y-2">
              <Label>کمیسیون ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.commission}
                onChange={(e) => handleChange("commission", e.target.value)}
                className="bg-secondary/60 tabular"
              />
            </div>
            <div className="space-y-2">
              <Label>سواپ ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.swap}
                onChange={(e) => handleChange("swap", e.target.value)}
                className="bg-secondary/60 tabular"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>تصویر معامله</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 text-center hover:bg-secondary/50">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {file ? file.name : "اسکرین‌شات چارت را بکشید یا انتخاب کنید"}
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label>توضیحات</Label>
            <Textarea
              rows={3}
              placeholder="توضیحات کلی درباره معامله..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="bg-secondary/60"
            />
          </div>
        </div>

        <div className="card-surface space-y-4 p-6">
          <h3 className="font-semibold">ژورنال معامله</h3>

          <div className="space-y-2">
            <Label>دلیل ورود</Label>
            <Textarea
              rows={2}
              placeholder="سیگنال، ست‌آپ، تحلیل..."
              value={formData.entry_reason}
              onChange={(e) => handleChange("entry_reason", e.target.value)}
              className="bg-secondary/60"
            />
          </div>
          <div className="space-y-2">
            <Label>دلیل خروج</Label>
            <Textarea
              rows={2}
              placeholder="تحقق تارگت، شکست ست‌آپ..."
              value={formData.exit_reason}
              onChange={(e) => handleChange("exit_reason", e.target.value)}
              className="bg-secondary/60"
            />
          </div>
          <div className="space-y-2">
            <Label>احساس قبل از ورود</Label>
            <Select
              value={formData.emotion_before}
              onValueChange={(val) => handleChange("emotion_before", val)}
            >
              <SelectTrigger className="bg-secondary/60">
                <SelectValue placeholder="انتخاب" />
              </SelectTrigger>
              <SelectContent>
                {["آرام", "متمرکز", "مضطرب", "طمع", "ترس", "انتقام"].map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>احساس بعد از خروج</Label>
            <Select
              value={formData.emotion_after}
              onValueChange={(val) => handleChange("emotion_after", val)}
            >
              <SelectTrigger className="bg-secondary/60">
                <SelectValue placeholder="انتخاب" />
              </SelectTrigger>
              <SelectContent>
                {["رضایت", "پشیمانی", "بی‌تفاوت", "هیجان", "خشم"].map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
            <div>
              <div className="text-sm font-medium">طبق پلن معامله شد؟</div>
              <div className="text-xs text-muted-foreground">پایبندی به قوانین</div>
            </div>
            <Switch
              checked={formData.followed_plan}
              onCheckedChange={(val) => handleChange("followed_plan", val)}
            />
          </div>
          <div className="space-y-2">
            <Label>اشتباهات</Label>
            <Textarea
              rows={2}
              placeholder="چه اشتباهاتی مرتکب شدی؟"
              value={formData.mistakes}
              onChange={(e) => handleChange("mistakes", e.target.value)}
              className="bg-secondary/60"
            />
          </div>
          <div className="space-y-2">
            <Label>درس آموخته‌شده</Label>
            <Textarea
              rows={2}
              placeholder="چه یاد گرفتی؟"
              value={formData.lessons}
              onChange={(e) => handleChange("lessons", e.target.value)}
              className="bg-secondary/60"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  ثبت معامله <ArrowRight className="mr-1 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/app/trades" })}
            >
              انصراف
            </Button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}