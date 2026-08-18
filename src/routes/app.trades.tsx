import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Download, CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trades } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/trades")({
  head: () => ({ meta: [{ title: "معاملات" }] }),
  component: TradesPage,
});

function TradesPage() {
  const [query, setQuery] = useState("");
  const [side, setSide] = useState<"all" | "buy" | "sell">("all");
  const [plan, setPlan] = useState<"all" | "yes" | "no">("all");
  const [result, setResult] = useState<"all" | "win" | "loss">("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => trades.filter((t) => {
    if (query && !t.symbol.toLowerCase().includes(query.toLowerCase())) return false;
    if (side !== "all" && t.side !== side) return false;
    if (plan === "yes" && !t.followedPlan) return false;
    if (plan === "no" && t.followedPlan) return false;
    if (result === "win" && t.pnl < 0) return false;
    if (result === "loss" && t.pnl >= 0) return false;
    return true;
  }), [query, side, plan, result]);

  return (
    <AppShell
      title="معاملات"
      subtitle="مشاهده و مدیریت تمام معاملات ثبت‌شده"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("خروجی CSV به‌زودی آماده می‌شود")}><Download className="ml-1 h-4 w-4" />خروجی</Button>
          <Link to="/app/trades/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="ml-1 h-4 w-4" />معامله جدید
            </Button>
          </Link>
        </div>
      }
    >
      <div className="card-surface p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی نماد..." className="max-w-xs bg-secondary/60" />
          <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Filter className="ml-1 h-4 w-4" />فیلترها</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>فیلتر معاملات</DialogTitle>
                <DialogDescription>معاملات را بر اساس معیارهای زیر فیلتر کن.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>نوع معامله</Label>
                  <Select value={side} onValueChange={(v) => setSide(v as any)}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="buy">فقط خرید</SelectItem>
                      <SelectItem value="sell">فقط فروش</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>پایبندی به پلن</Label>
                  <Select value={plan} onValueChange={(v) => setPlan(v as any)}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="yes">طبق پلن</SelectItem>
                      <SelectItem value="no">خارج از پلن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>نتیجه</Label>
                  <Select value={result} onValueChange={(v) => setResult(v as any)}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="win">فقط برنده</SelectItem>
                      <SelectItem value="loss">فقط بازنده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => { setSide("all"); setPlan("all"); setResult("all"); toast.success("فیلترها پاک شد"); }}>پاک کردن</Button>
                <DialogClose asChild><Button className="bg-primary text-primary-foreground hover:bg-primary/90">اعمال</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-3 text-right font-medium">شناسه</th>
                <th className="py-3 text-right font-medium">نماد</th>
                <th className="py-3 text-right font-medium">نوع</th>
                <th className="py-3 text-right font-medium">ورود</th>
                <th className="py-3 text-right font-medium">خروج</th>
                <th className="py-3 text-right font-medium">حجم</th>
                <th className="py-3 text-right font-medium">R:R</th>
                <th className="py-3 text-right font-medium">سود/زیان</th>
                <th className="py-3 text-right font-medium">پلن</th>
                <th className="py-3 text-right font-medium">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 last:border-0">
                  <td className="py-3 text-xs tabular text-muted-foreground">{t.id}</td>
                  <td className="py-3 font-medium">{t.symbol}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={t.side === "buy" ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}>
                      {t.side === "buy" ? "خرید" : "فروش"}
                    </Badge>
                  </td>
                  <td className="py-3 tabular">{t.entry}</td>
                  <td className="py-3 tabular">{t.exit}</td>
                  <td className="py-3 tabular">{t.volume}</td>
                  <td className="py-3 tabular">{t.rr}</td>
                  <td className={`py-3 tabular font-medium ${t.pnl >= 0 ? "gain" : "loss"}`}>
                    {t.pnl >= 0 ? "+" : ""}${t.pnl}
                  </td>
                  <td className="py-3">
                    {t.followedPlan ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </td>
                  <td className="py-3 text-xs text-muted-foreground tabular">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
