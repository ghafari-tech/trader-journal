import { createFileRoute } from "@tanstack/react-router";
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { goals as seedGoals } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/goals")({
  head: () => ({ meta: [{ title: "اهداف معاملاتی" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const [goals, setGoals] = useState(seedGoals);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("سود");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("عنوان هدف را وارد کنید");
      return;
    }
    setGoals((g) => [...g, { id: `G${g.length + 1}`, title: title.trim(), progress: 0 }]);
    toast.success(`هدف «${title.trim()}» اضافه شد`);
    setTitle("");
    setType("سود");
    setOpen(false);
  }

  return (
    <AppShell
      title="اهداف معاملاتی"
      subtitle="اهداف خود را تعریف کنید و میزان پیشرفت را ببینید"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="ml-1 h-4 w-4" />هدف جدید
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={submit}>
              <DialogHeader>
                <DialogTitle>هدف معاملاتی جدید</DialogTitle>
                <DialogDescription>یک هدف قابل اندازه‌گیری تعریف کن تا پیشرفتت را دنبال کنیم.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>عنوان هدف</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: ۱۵٪ سود ماهانه" className="bg-secondary/60" />
                </div>
                <div className="space-y-2">
                  <Label>نوع هدف</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-secondary/60"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["سود", "ریسک", "نظم", "یادگیری"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>مقدار هدف</Label>
                    <Input type="number" placeholder="۱۵" className="bg-secondary/60 tabular" />
                  </div>
                  <div className="space-y-2">
                    <Label>مهلت (روز)</Label>
                    <Input type="number" placeholder="۳۰" className="bg-secondary/60 tabular" />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <DialogClose asChild><Button type="button" variant="outline">انصراف</Button></DialogClose>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">ثبت هدف</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g) => (
          <div key={g.id} className="card-surface p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{g.title}</h3>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">پیشرفت</span>
                  <span className="font-bold tabular gain">{g.progress}٪</span>
                </div>
                <Progress value={g.progress} className="mt-2 h-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
