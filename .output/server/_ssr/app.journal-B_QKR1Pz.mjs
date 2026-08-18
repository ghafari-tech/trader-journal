import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
import { t as Badge } from "./badge-DHlcf1ty.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as CircleX, L as CircleCheck, Y as BookOpen, b as Plus, k as Funnel, v as Search } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-saF5BTPQ.mjs";
import { s as journalEntries } from "./mock-data-BnneBzB8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.mjs";
import { t as Label } from "./label-AutfcB-T.mjs";
import { a as DialogFooter, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogHeader, r as DialogContent, s as DialogTitle, t as Dialog } from "./dialog-DfkAzG_d.mjs";
import { t as Textarea } from "./textarea-Cp94w9lz.mjs";
import { t as Switch } from "./switch-Cp8Exbjp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.journal-B_QKR1Pz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JournalPage() {
	const [entries, setEntries] = (0, import_react.useState)(journalEntries);
	const [newOpen, setNewOpen] = (0, import_react.useState)(false);
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [planFilter, setPlanFilter] = (0, import_react.useState)("all");
	const [emotionFilter, setEmotionFilter] = (0, import_react.useState)("all");
	const [nTitle, setNTitle] = (0, import_react.useState)("");
	const [nTrade, setNTrade] = (0, import_react.useState)("");
	const [nEmotion, setNEmotion] = (0, import_react.useState)("آرام");
	const [nMistakes, setNMistakes] = (0, import_react.useState)("");
	const [nLesson, setNLesson] = (0, import_react.useState)("");
	const [nPlan, setNPlan] = (0, import_react.useState)(true);
	const filtered = (0, import_react.useMemo)(() => {
		return entries.filter((e) => {
			if (query && !`${e.title} ${e.tradeId} ${e.emotion}`.toLowerCase().includes(query.toLowerCase())) return false;
			if (planFilter === "yes" && !e.plan) return false;
			if (planFilter === "no" && e.plan) return false;
			if (emotionFilter !== "all" && e.emotion !== emotionFilter) return false;
			return true;
		});
	}, [
		entries,
		query,
		planFilter,
		emotionFilter
	]);
	function submit(e) {
		e.preventDefault();
		if (!nTitle.trim()) {
			toast.error("عنوان ژورنال را وارد کنید");
			return;
		}
		setEntries((list) => [{
			id: `J${list.length + 1}`,
			date: "امروز",
			tradeId: nTrade || "—",
			title: nTitle,
			mistakes: nMistakes,
			lesson: nLesson,
			emotion: nEmotion,
			plan: nPlan
		}, ...list]);
		toast.success("ژورنال با موفقیت ثبت شد");
		setNTitle("");
		setNTrade("");
		setNMistakes("");
		setNLesson("");
		setNEmotion("آرام");
		setNPlan(true);
		setNewOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "ژورنال معاملاتی",
		subtitle: "یادداشت‌ها، درس‌ها و احساسات هر معامله",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: filterOpen,
				onOpenChange: setFilterOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "ml-1 h-4 w-4" }), "فیلترها"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "فیلتر ژورنال" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "نتایج را با معیارهای زیر محدود کن." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "جستجو" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "عنوان، شناسه معامله...",
										className: "bg-secondary/60 pr-9"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "پایبندی به پلن" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: planFilter,
									onValueChange: (v) => setPlanFilter(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-secondary/60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "همه"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "yes",
											children: "فقط طبق پلن"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "no",
											children: "فقط خارج از پلن"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "احساس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: emotionFilter,
									onValueChange: setEmotionFilter,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-secondary/60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "همه"
									}), [
										"آرام",
										"متمرکز",
										"طمع",
										"ترس",
										"انتقام"
									].map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: e,
										children: e
									}, e))] })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								setQuery("");
								setPlanFilter("all");
								setEmotionFilter("all");
								toast.success("فیلترها پاک شد");
							},
							children: "پاک کردن"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-primary text-primary-foreground hover:bg-primary/90",
								children: "اعمال"
							})
						})]
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: newOpen,
				onOpenChange: setNewOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-primary text-primary-foreground hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "ml-1 h-4 w-4" }), "ژورنال جدید"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "ژورنال جدید" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "یادداشت خود درباره یک معامله را ثبت کن." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عنوان" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: nTitle,
												onChange: (e) => setNTitle(e.target.value),
												className: "bg-secondary/60"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "شناسه معامله" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: nTrade,
												onChange: (e) => setNTrade(e.target.value),
												placeholder: "T-1043",
												className: "bg-secondary/60 tabular"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "احساس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: nEmotion,
											onValueChange: setNEmotion,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "bg-secondary/60",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
												"آرام",
												"متمرکز",
												"طمع",
												"ترس",
												"انتقام"
											].map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: e,
												children: e
											}, e)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "اشتباهات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											value: nMistakes,
											onChange: (e) => setNMistakes(e.target.value),
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "درس آموخته‌شده" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											value: nLesson,
											onChange: (e) => setNLesson(e.target.value),
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg bg-secondary/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm",
											children: "طبق پلن معامله شد؟"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: nPlan,
											onCheckedChange: setNPlan
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										children: "انصراف"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-primary text-primary-foreground hover:bg-primary/90",
									children: "ثبت ژورنال"
								})]
							})
						]
					})
				})]
			})]
		}),
		children: [(query || planFilter !== "all" || emotionFilter !== "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "فیلتر فعال:"
				}),
				query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					children: ["جستجو: ", query]
				}),
				planFilter !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: planFilter === "yes" ? "طبق پلن" : "خارج از پلن"
				}),
				emotionFilter !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					children: ["احساس: ", emotionFilter]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-primary hover:underline",
					onClick: () => {
						setQuery("");
						setPlanFilter("all");
						setEmotionFilter("all");
					},
					children: "پاک کردن"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface col-span-full p-12 text-center text-sm text-muted-foreground",
				children: "هیچ ژورنالی با این فیلتر پیدا نشد."
			}), filtered.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "card-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: j.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 flex items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: j.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: j.tradeId
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: j.plan ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive",
						children: [j.plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "ml-1 h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "ml-1 h-3 w-3" }), j.plan ? "طبق پلن" : "خارج از پلن"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium text-muted-foreground",
							children: "احساس"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1",
							children: j.emotion
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium text-muted-foreground",
							children: "اشتباهات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-foreground/90",
							children: j.mistakes
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-primary/30 bg-primary/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium text-primary",
								children: "درس آموخته‌شده"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-foreground/90",
								children: j.lesson
							})]
						})
					]
				})]
			}, j.id))]
		})]
	});
}
//#endregion
export { JournalPage as component };
