import { createFileRoute } from "@tanstack/react-router";
import { Plus, MoreVertical, Wallet, Archive, Edit, Link2 } from "lucide-react";
import { useState } from "react";
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
import { portfolios as seed } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/portfolios")({
  head: () => ({ meta: [{ title: "پرتفولیوها" }] }),
  component: Portfolios,
});

function Portfolios() {
  const [portfolios, setPortfolios] = useState(seed);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [broker, setBroker] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [leverage, setLeverage] = useState("1:100");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !broker.trim()) { toast.error("نام و بروکر الزامی است"); return; }
    const initial = Number(balance) || 0;
    setPortfolios((p) => [
      ...p,
      { id: `P${p.length + 1}`, name: name.trim(), broker: broker.trim(), type: "استاندارد", balance: initial, initial, leverage, currency, trades: 0, status: "فعال" },
    ]);
    toast.success(`پرتفولیو «${name.trim()}» ساخته شد`);
    setName(""); setBroker(""); setBalance(""); setCurrency("USD"); setLeverage("1:100");
    setOpen(false);
  }

  return (
    <AppShell
      title="پرتفولیوها"
      subtitle="مدیریت حساب‌های معاملاتی و اتصال به بروکرها"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="ml-1 h-4 w-4" />
              پرتفولیو جدید
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={submit}>
              <DialogHeader>
                <DialogTitle>پرتفولیو جدید</DialogTitle>
                <DialogDescription>یک حساب معاملاتی جدید اضافه کن. بعداً می‌توانی به MT4/MT5 متصل کنی.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>نام پرتفولیو</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="پرتفوی اصلی" className="bg-secondary/60" />
                </div>
                <div className="space-y-2">
                  <Label>بروکر</Label>
                  <Input value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="IC Markets" className="bg-secondary/60" />
                </div>
                <div className="space-y-2">
                  <Label>موجودی اولیه</Label>
                  <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="bg-secondary/60 tabular" />
                </div>
                <div className="space-y-2">
                  <Label>ارز</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["USD", "USDT", "EUR", "IRR"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>لوریج</Label>
                  <Select value={leverage} onValueChange={setLeverage}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["1:1", "1:30", "1:100", "1:200", "1:500"].map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <DialogClose asChild><Button type="button" variant="outline">انصراف</Button></DialogClose>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">ایجاد پرتفولیو</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {portfolios.map((p) => {
          const pnl = p.balance - p.initial;
          const pct = p.initial ? (pnl / p.initial) * 100 : 0;
          return (
            <div key={p.id} className="card-surface p-5 transition-all hover:border-primary/40">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.broker}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info("منوی گزینه‌ها به‌زودی")}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/40 p-3">
                  <div className="text-[11px] text-muted-foreground">موجودی فعلی</div>
                  <div className="mt-1 text-lg font-bold tabular">
                    ${p.balance.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-3">
                  <div className="text-[11px] text-muted-foreground">سود / زیان</div>
                  <div className={`mt-1 text-lg font-bold tabular ${pnl >= 0 ? "gain" : "loss"}`}>
                    {pnl >= 0 ? "+" : ""}${pnl.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">لوریج:</span> <span className="tabular">{p.leverage}</span></div>
                <div><span className="text-muted-foreground">ارز:</span> {p.currency}</div>
                <div><span className="text-muted-foreground">معاملات:</span> <span className="tabular">{p.trades}</span></div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <Badge variant="outline" className={p.status === "فعال" ? "border-primary/40 bg-primary/10 text-primary" : ""}>
                  {p.status}
                </Badge>
                <div className={`text-sm font-medium tabular ${pct >= 0 ? "gain" : "loss"}`}>
                  {pct >= 0 ? "+" : ""}{pct.toFixed(2)}٪
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`اتصال ${p.name} به متاتریدر شروع شد`)}>
                  <Link2 className="ml-1 h-3 w-3" />اتصال MT
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("ویرایش به‌زودی")}><Edit className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline" onClick={() => toast.success(`${p.name} آرشیو شد`)}><Archive className="h-3 w-3" /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
