import { createFileRoute } from "@tanstack/react-router";
import { Plus, BookOpen, CheckCircle2, XCircle, Filter, Search as SearchIcon } from "lucide-react";
import { useEffect,useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
export const Route = createFileRoute("/app/journal")({
  head: () => ({ meta: [{ title: "ژورنال" }] }),
  component: JournalPage,
});
  function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetch("https://trade.piqqgram.ir/app/journal/")
      .then((res) => res.json())
      .then((data) => {
        const mappedJournals = data.journals.map((j: any) => ({
          id: j.id,
          date: j.date,
          title: j.title,
          tradeId: j.transaction_id,
          emotion: j.feel,
          mistakes: j.mistakes,
          lesson: j.lesson_learned,
          plan: j.followed_plan,
        }));

        setEntries(mappedJournals);
      })
      .catch((error) => {
        console.error("Error fetching journals:", error);
      });
  }, []);

  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "yes" | "no">("all");
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const [nTitle, setNTitle] = useState("");
  const [nTrade, setNTrade] = useState("");
  const [nEmotion, setNEmotion] = useState("آرام");
  const [nMistakes, setNMistakes] = useState("");
  const [nLesson, setNLesson] = useState("");
  const [nPlan, setNPlan] = useState(true);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (query && !`${e.title} ${e.tradeId} ${e.emotion}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (planFilter === "yes" && !e.plan) return false;
      if (planFilter === "no" && e.plan) return false;
      if (emotionFilter !== "all" && e.emotion !== emotionFilter) return false;
      return true;
    });
  }, [entries, query, planFilter, emotionFilter]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nTitle.trim()) { toast.error("عنوان ژورنال را وارد کنید"); return; }
    setEntries((list) => [
      { id: `J${list.length + 1}`, date: "امروز", tradeId: nTrade || "—", title: nTitle, mistakes: nMistakes, lesson: nLesson, emotion: nEmotion, plan: nPlan },
      ...list,
    ]);
    toast.success("ژورنال با موفقیت ثبت شد");
    setNTitle(""); setNTrade(""); setNMistakes(""); setNLesson(""); setNEmotion("آرام"); setNPlan(true);
    setNewOpen(false);
  }

  return (
    <AppShell
      title="ژورنال معاملاتی"
      subtitle="یادداشت‌ها، درس‌ها و احساسات هر معامله"
      actions={
        <div className="flex gap-2">
          <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Filter className="ml-1 h-4 w-4" />فیلترها</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>فیلتر ژورنال</DialogTitle>
                <DialogDescription>نتایج را با معیارهای زیر محدود کن.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>جستجو</Label>
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="عنوان، شناسه معامله..." className="bg-secondary/60 pr-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>پایبندی به پلن</Label>
                  <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as any)}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="yes">فقط طبق پلن</SelectItem>
                      <SelectItem value="no">فقط خارج از پلن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>احساس</Label>
                  <Select value={emotionFilter} onValueChange={setEmotionFilter}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      {["آرام", "متمرکز", "طمع", "ترس", "انتقام"].map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => { setQuery(""); setPlanFilter("all"); setEmotionFilter("all"); toast.success("فیلترها پاک شد"); }}>پاک کردن</Button>
                <DialogClose asChild><Button className="bg-primary text-primary-foreground hover:bg-primary/90">اعمال</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="ml-1 h-4 w-4" />ژورنال جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <form onSubmit={submit}>
                <DialogHeader>
                  <DialogTitle>ژورنال جدید</DialogTitle>
                  <DialogDescription>یادداشت خود درباره یک معامله را ثبت کن.</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>عنوان</Label>
                      <Input value={nTitle} onChange={(e) => setNTitle(e.target.value)} className="bg-secondary/60" />
                    </div>
                    <div className="space-y-2">
                      <Label>شناسه معامله</Label>
                      <Input value={nTrade} onChange={(e) => setNTrade(e.target.value)} placeholder="T-1043" className="bg-secondary/60 tabular" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>احساس</Label>
                    <Select value={nEmotion} onValueChange={setNEmotion}>
                      <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["آرام", "متمرکز", "طمع", "ترس", "انتقام"].map((e) => (
                          <SelectItem key={e} value={e}>{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>اشتباهات</Label>
                    <Textarea rows={2} value={nMistakes} onChange={(e) => setNMistakes(e.target.value)} className="bg-secondary/60" />
                  </div>
                  <div className="space-y-2">
                    <Label>درس آموخته‌شده</Label>
                    <Textarea rows={2} value={nLesson} onChange={(e) => setNLesson(e.target.value)} className="bg-secondary/60" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
                    <div className="text-sm">طبق پلن معامله شد؟</div>
                    <Switch checked={nPlan} onCheckedChange={setNPlan} />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <DialogClose asChild><Button type="button" variant="outline">انصراف</Button></DialogClose>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">ثبت ژورنال</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {(query || planFilter !== "all" || emotionFilter !== "all") && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">فیلتر فعال:</span>
          {query && <Badge variant="outline">جستجو: {query}</Badge>}
          {planFilter !== "all" && <Badge variant="outline">{planFilter === "yes" ? "طبق پلن" : "خارج از پلن"}</Badge>}
          {emotionFilter !== "all" && <Badge variant="outline">احساس: {emotionFilter}</Badge>}
          <button className="text-primary hover:underline" onClick={() => { setQuery(""); setPlanFilter("all"); setEmotionFilter("all"); }}>پاک کردن</button>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.length === 0 && (
          <div className="card-surface col-span-full p-12 text-center text-sm text-muted-foreground">
            هیچ ژورنالی با این فیلتر پیدا نشد.
          </div>
        )}
        {filtered.map((j) => (
          <article key={j.id} className="card-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">{j.title}</h3>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="tabular">{j.date}</span>
                    <span>•</span>
                    <span className="tabular">{j.tradeId}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={j.plan ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}>
                {j.plan ? <CheckCircle2 className="ml-1 h-3 w-3" /> : <XCircle className="ml-1 h-3 w-3" />}
                {j.plan ? "طبق پلن" : "خارج از پلن"}
              </Badge>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div>
                <div className="text-xs font-medium text-muted-foreground">احساس</div>
                <div className="mt-1">{j.emotion}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">اشتباهات</div>
                <div className="mt-1 text-foreground/90">{j.mistakes}</div>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="text-xs font-medium text-primary">درس آموخته‌شده</div>
                <div className="mt-1 text-foreground/90">{j.lesson}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
