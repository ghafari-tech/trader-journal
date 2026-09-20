// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import { Pencil, Plus, Target, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// import { AppShell } from "@/components/AppShell";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { ApiError } from "@/api/client";
// import {
//   addGoal,
//   deleteGoal,
//   editGoal,
//   listGoals,
//   type Goal,
//   type GoalInput,
//   type GoalTargetType,
// } from "@/api/goals";
// import { toast } from "sonner";

// export const Route = createFileRoute("/app/goals")({
//   head: () => ({
//     meta: [{ title: "اهداف معاملاتی" }],
//   }),
//   component: GoalsPage,
// });

// const typeOptions: { label: string; value: GoalTargetType }[] = [
//   { label: "سود", value: "profit" },
//   { label: "ریسک", value: "risk" },
//   { label: "نظم", value: "order" },
//   { label: "یادگیری", value: "learning" },
// ];

// const emptyForm = {
//   title: "",
//   type: "profit" as GoalTargetType,
//   targetValue: "",
//   deadlineDays: "",
// };

// function GoalsPage() {
//   const navigate = useNavigate();
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState(emptyForm);
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   async function loadGoals() {
//     try {
//       setPageLoading(true);
//       setGoals(await listGoals());
//     } catch (error) {
//       if (error instanceof ApiError && error.status === 401) {
//         toast.error("نشست شما منقضی شده است. دوباره وارد شوید");
//         navigate({ to: "/login" });
//         return;
//       }
//       toast.error(error instanceof Error ? error.message : "خواندن اهداف با خطا مواجه شد");
//     } finally {
//       setPageLoading(false);
//     }
//   }

//   useEffect(() => {
//     void loadGoals();
//   }, []);

//   function resetForm() {
//     setForm(emptyForm);
//     setEditingId(null);
//   }

//   function openCreate() {
//     resetForm();
//     setOpen(true);
//   }

//   function openEdit(goal: Goal) {
//     const remainingDays = goal.deadline
//       ? Math.max(
//           1,
//           Math.ceil(
//             (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
//           ),
//         )
//       : "30";

//     setEditingId(goal.id);
//     setForm({
//       title: goal.title,
//       type: goal.target_type,
//       targetValue: String(goal.target_value || ""),
//       deadlineDays: String(remainingDays),
//     });
//     setOpen(true);
//   }

//   function buildPayload(): GoalInput | null {
//     if (!form.title.trim()) {
//       toast.error("عنوان هدف را وارد کنید");
//       return null;
//     }
//     if (!form.targetValue) {
//       toast.error("مقدار هدف را وارد کنید");
//       return null;
//     }
//     if (!form.deadlineDays) {
//       toast.error("مهلت هدف را وارد کنید");
//       return null;
//     }

//     const deadline = new Date();
//     deadline.setDate(deadline.getDate() + Number(form.deadlineDays));

//     return {
//       title: form.title.trim(),
//       target_type: form.type,
//       target_value: Number(form.targetValue),
//       deadline: deadline.toISOString(),
//     };
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     const payload = buildPayload();
//     if (!payload) return;

//     try {
//       setLoading(true);
//       if (editingId) {
//         const updated = await editGoal(editingId, payload);
//         setGoals((current) =>
//           current.map((goal) => (goal.id === editingId ? { ...goal, ...updated } : goal)),
//         );
//         toast.success(`هدف «${payload.title}» به‌روزرسانی شد`);
//       } else {
//         const created = await addGoal(payload);
//         setGoals((current) => [...current, created]);
//         toast.success(`هدف «${payload.title}» با موفقیت اضافه شد`);
//       }

//       resetForm();
//       setOpen(false);
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "ثبت هدف با خطا مواجه شد");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function removeGoal(goal: Goal) {
//     if (!window.confirm(`هدف «${goal.title}» حذف شود؟`)) return;

//     try {
//       await deleteGoal(goal.id);
//       setGoals((current) => current.filter((item) => item.id !== goal.id));
//       toast.success("هدف حذف شد");
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "حذف هدف با خطا مواجه شد");
//     }
//   }

//   return (
//     <AppShell
//       title="اهداف معاملاتی"
//       subtitle="اهداف خود را تعریف کنید و میزان پیشرفت را ببینید"
//       actions={
//         <Dialog
//           open={open}
//           onOpenChange={(nextOpen) => {
//             setOpen(nextOpen);
//             if (!nextOpen) resetForm();
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openCreate}>
//               <Plus className="ml-1 h-4 w-4" />
//               هدف جدید
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <form onSubmit={submit}>
//               <DialogHeader>
//                 <DialogTitle>{editingId ? "ویرایش هدف" : "هدف معاملاتی جدید"}</DialogTitle>
//                 <DialogDescription>
//                   یک هدف قابل اندازه‌گیری تعریف کن تا پیشرفتت را دنبال کنیم.
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="mt-4 space-y-4">
//                 <div className="space-y-2">
//                   <Label>عنوان هدف</Label>
//                   <Input
//                     value={form.title}
//                     onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
//                     placeholder="مثلاً: ۱۵٪ سود ماهانه"
//                     className="bg-secondary/60"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>نوع هدف</Label>
//                   <Select
//                     value={form.type}
//                     onValueChange={(value) =>
//                       setForm((current) => ({ ...current, type: value as GoalTargetType }))
//                     }
//                   >
//                     <SelectTrigger className="bg-secondary/60">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {typeOptions.map((item) => (
//                         <SelectItem key={item.value} value={item.value}>
//                           {item.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-2">
//                     <Label>مقدار هدف</Label>
//                     <Input
//                       type="number"
//                       value={form.targetValue}
//                       onChange={(e) =>
//                         setForm((current) => ({ ...current, targetValue: e.target.value }))
//                       }
//                       placeholder="۱۵"
//                       className="bg-secondary/60 tabular"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>مهلت (روز)</Label>
//                     <Input
//                       type="number"
//                       min="1"
//                       value={form.deadlineDays}
//                       onChange={(e) =>
//                         setForm((current) => ({ ...current, deadlineDays: e.target.value }))
//                       }
//                       placeholder="۳۰"
//                       className="bg-secondary/60 tabular"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <DialogFooter className="mt-6">
//                 <DialogClose asChild>
//                   <Button type="button" variant="outline" disabled={loading}>
//                     انصراف
//                   </Button>
//                 </DialogClose>
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-primary text-primary-foreground hover:bg-primary/90"
//                 >
//                   {loading ? "در حال ثبت..." : editingId ? "ذخیره تغییرات" : "ثبت هدف"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       }
//     >
//       {pageLoading ? (
//         <div className="card-surface p-6 text-sm text-muted-foreground">در حال بارگذاری اهداف...</div>
//       ) : goals.length === 0 ? (
//         <div className="card-surface p-6 text-sm text-muted-foreground">
//           هنوز هدفی ثبت نشده است. اگر توکن منقضی شده، از صفحه{" "}
//           <Link to="/login" className="text-primary hover:underline">
//             ورود
//           </Link>{" "}
//           دوباره وارد شوید.
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2">
//           {goals.map((goal) => (
//             <div key={goal.id} className="card-surface p-6">
//               <div className="flex items-start gap-3">
//                 <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
//                   <Target className="h-4 w-4" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between gap-2">
//                     <h3 className="font-semibold">{goal.title}</h3>
//                     <div className="flex gap-1">
//                       <Button type="button" size="icon" variant="ghost" onClick={() => openEdit(goal)}>
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button type="button" size="icon" variant="ghost" onClick={() => void removeGoal(goal)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="mt-4 flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">پیشرفت</span>
//                     <span className="font-bold tabular gain">{goal.progress}٪</span>
//                   </div>
//                   <Progress value={goal.progress} className="mt-2 h-2" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </AppShell>
//   );
// }


import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Pencil, Plus, Target, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ApiError } from "@/api/client";
import {
  addGoal,
  deleteGoal,
  editGoal,
  listGoals,
  type Goal,
  type GoalInput,
  type GoalTargetType,
} from "@/api/goals";

import { toast } from "sonner";

export const Route = createFileRoute("/app/goals")({
  head: () => ({
    meta: [{ title: "اهداف معاملاتی" }],
  }),
  component: GoalsPage,
});

const typeOptions: {
  label: string;
  value: GoalTargetType;
}[] = [
  { label: "سود", value: "profit" },
  { label: "ریسک", value: "risk" },
  { label: "نظم", value: "order" },
  { label: "یادگیری", value: "learning" },
];

const emptyForm = {
  title: "",
  type: "profit" as GoalTargetType,
  targetValue: "",
  deadlineDays: "",
};

function GoalsPage() {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  async function loadGoals() {
    try {
      setPageLoading(true);

      const data = await listGoals();

      setGoals(data);
    } catch (error) {
      console.error("Load goals error:", error);

      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        toast.error(
          "نشست شما منقضی شده است. دوباره وارد شوید.",
        );

        navigate({ to: "/login" });
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "خواندن اهداف با خطا مواجه شد",
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    void loadGoals();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(goal: Goal) {
    let remainingDays = 30;

    if (goal.deadline) {
      const diff =
        new Date(goal.deadline).getTime() -
        Date.now();

      remainingDays = Math.max(
        1,
        Math.ceil(
          diff /
            (1000 * 60 * 60 * 24),
        ),
      );
    }

    setEditingId(goal.id);

    setForm({
      title: goal.title,
      type: goal.target_type,
      targetValue: String(
        goal.target_value ?? "",
      ),
      deadlineDays: String(
        remainingDays,
      ),
    });

    setOpen(true);
  }

  function buildPayload(): GoalInput | null {
    const title = form.title.trim();

    if (!title) {
      toast.error("عنوان هدف را وارد کنید");
      return null;
    }

    const targetValue = Number(
      form.targetValue,
    );

    if (
      !form.targetValue ||
      !Number.isFinite(targetValue)
    ) {
      toast.error(
        "مقدار هدف را صحیح وارد کنید",
      );
      return null;
    }

    const deadlineDays = Number(
      form.deadlineDays,
    );

    if (
      !form.deadlineDays ||
      !Number.isFinite(deadlineDays) ||
      deadlineDays < 1
    ) {
      toast.error(
        "مهلت هدف را صحیح وارد کنید",
      );
      return null;
    }

    const deadline = new Date();

    deadline.setDate(
      deadline.getDate() +
        deadlineDays,
    );

    return {
      title,
      target_type: form.type,
      target_value: targetValue,
      deadline:
        deadline.toISOString(),
    };
  }

  async function submit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (loading) return;

    const payload =
      buildPayload();

    if (!payload) return;

    try {
      setLoading(true);

      if (editingId) {
        await editGoal(
          editingId,
          payload,
        );

        toast.success(
          `هدف «${payload.title}» به‌روزرسانی شد`,
        );
      } else {
        await addGoal(payload);

        toast.success(
          `هدف «${payload.title}» با موفقیت اضافه شد`,
        );
      }

      /*
       * به جای اعتماد کامل به پاسخ POST،
       * لیست واقعی را دوباره از سرور می‌گیریم.
       */
      const freshGoals =
        await listGoals();

      setGoals(freshGoals);

      resetForm();
      setOpen(false);
    } catch (error) {
      console.error(
        "Save goal error:",
        error,
      );

      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        toast.error(
          "نشست شما منقضی شده است. دوباره وارد شوید.",
        );

        navigate({ to: "/login" });
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "ثبت هدف با خطا مواجه شد",
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeGoal(
    goal: Goal,
  ) {
    if (loading) return;

    const confirmed =
      window.confirm(
        `هدف «${goal.title}» حذف شود؟`,
      );

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteGoal(
        goal.id,
      );

      setGoals(
        (current) =>
          current.filter(
            (item) =>
              item.id !== goal.id,
          ),
      );

      toast.success(
        "هدف حذف شد",
      );
    } catch (error) {
      console.error(
        "Delete goal error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "حذف هدف ناموفق بود",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="اهداف معاملاتی"
      subtitle="اهداف خود را تعریف کنید و میزان پیشرفت را ببینید"
      actions={
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => {
            if (loading) return;

            setOpen(nextOpen);

            if (!nextOpen) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={openCreate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="ml-1 h-4 w-4" />
              هدف جدید
            </Button>
          </DialogTrigger>

          <DialogContent
            dir="rtl"
            className="
              w-[calc(100%-1rem)]
              max-w-lg
              max-h-[calc(100dvh-1rem)]
              overflow-hidden
              p-4
              sm:p-6
            "
          >
            <form
              onSubmit={submit}
              className="flex max-h-[calc(100dvh-2rem)] flex-col"
            >
              <DialogHeader className="shrink-0 text-right">
                <DialogTitle className="text-right text-lg sm:text-xl">
                  {editingId
                    ? "ویرایش هدف"
                    : "هدف معاملاتی جدید"}
                </DialogTitle>

                <DialogDescription className="pt-1 text-right text-sm leading-6">
                  یک هدف قابل اندازه‌گیری تعریف کن تا پیشرفتت را دنبال کنیم.
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 pr-1 sm:py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      عنوان هدف
                    </Label>

                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm(
                          (current) => ({
                            ...current,
                            title: e
                              .target
                              .value,
                          }),
                        )
                      }
                      placeholder="مثلاً: ۱۵٪ سود ماهانه"
                      className="bg-secondary/60"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      نوع هدف
                    </Label>

                    <Select
                      value={form.type}
                      onValueChange={(
                        value,
                      ) =>
                        setForm(
                          (current) => ({
                            ...current,
                            type: value as GoalTargetType,
                          }),
                        )
                      }
                    >
                      <SelectTrigger className="w-full bg-secondary/60">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent
                        dir="rtl"
                        position="popper"
                      >
                        {typeOptions.map(
                          (item) => (
                            <SelectItem
                              key={
                                item.value
                              }
                              value={
                                item.value
                              }
                            >
                              {
                                item.label
                              }
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        مقدار هدف
                      </Label>

                      <Input
                        type="number"
                        inputMode="decimal"
                        value={
                          form.targetValue
                        }
                        onChange={(
                          e,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,
                              targetValue:
                                e
                                  .target
                                  .value,
                            }),
                          )
                        }
                        placeholder="۱۵"
                        className="bg-secondary/60 tabular"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        مهلت (روز)
                      </Label>

                      <Input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        value={
                          form.deadlineDays
                        }
                        onChange={(
                          e,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,
                              deadlineDays:
                                e
                                  .target
                                  .value,
                            }),
                          )
                        }
                        placeholder="۳۰"
                        className="bg-secondary/60 tabular"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter
                className="
                  mt-2
                  shrink-0
                  flex
                  flex-col-reverse
                  gap-2
                  sm:flex-row
                  sm:justify-start
                "
              >
                <DialogClose
                  asChild
                >
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    انصراف
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  {loading
                    ? "در حال ثبت..."
                    : editingId
                      ? "ذخیره تغییرات"
                      : "ثبت هدف"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {pageLoading ? (
        <div className="card-surface p-6 text-center text-sm text-muted-foreground">
          در حال بارگذاری اهداف...
        </div>
      ) : goals.length === 0 ? (
        <div className="card-surface p-6 text-center text-sm text-muted-foreground">
          هنوز هدفی ثبت نشده است.
          <div className="mt-2">
            اگر توکن منقضی شده، از صفحه{" "}
            <Link
              to="/login"
              className="text-primary hover:underline"
            >
              ورود
            </Link>{" "}
            دوباره وارد شوید.
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map(
            (goal) => (
              <div
                key={goal.id}
                className="card-surface p-4 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 break-words font-semibold">
                        {goal.title}
                      </h3>

                      <div className="flex shrink-0 gap-0.5">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9"
                          onClick={() =>
                            openEdit(
                              goal,
                            )
                          }
                          disabled={
                            loading
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-red-500 hover:text-red-500"
                          onClick={() =>
                            void removeGoal(
                              goal,
                            )
                          }
                          disabled={
                            loading
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        پیشرفت
                      </span>

                      <span className="font-bold tabular gain">
                        {goal.progress}
                        ٪
                      </span>
                    </div>

                    <Progress
                      value={
                        goal.progress
                      }
                      className="mt-2 h-2"
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </AppShell>
  );
}``
