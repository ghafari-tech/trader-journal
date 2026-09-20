import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
import { t as Badge } from "./badge-DHlcf1ty.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { I as CircleX, L as CircleCheck, b as Plus, j as Download, k as Funnel } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-saF5BTPQ.mjs";
import { d as trades } from "./mock-data-BnneBzB8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.mjs";
import { t as Label } from "./label-AutfcB-T.mjs";
import { a as DialogFooter, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogHeader, r as DialogContent, s as DialogTitle, t as Dialog } from "./dialog-DfkAzG_d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.trades-8jw1dHgN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TradesPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [side, setSide] = (0, import_react.useState)("all");
	const [plan, setPlan] = (0, import_react.useState)("all");
	const [result, setResult] = (0, import_react.useState)("all");
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => trades.filter((t) => {
		if (query && !t.symbol.toLowerCase().includes(query.toLowerCase())) return false;
		if (side !== "all" && t.side !== side) return false;
		if (plan === "yes" && !t.followedPlan) return false;
		if (plan === "no" && t.followedPlan) return false;
		if (result === "win" && t.pnl < 0) return false;
		if (result === "loss" && t.pnl >= 0) return false;
		return true;
	}), [
		query,
		side,
		plan,
		result
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "معاملات",
		subtitle: "مشاهده و مدیریت تمام معاملات ثبت‌شده",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => toast.success("خروجی CSV به‌زودی آماده می‌شود"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "ml-1 h-4 w-4" }), "خروجی"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/trades/new",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "ml-1 h-4 w-4" }), "معامله جدید"]
				})
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "جستجوی نماد...",
					className: "max-w-xs bg-secondary/60"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: filterOpen,
					onOpenChange: setFilterOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "ml-1 h-4 w-4" }), "فیلترها"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "فیلتر معاملات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "معاملات را بر اساس معیارهای زیر فیلتر کن." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نوع معامله" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: side,
										onValueChange: (v) => setSide(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-secondary/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "همه"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "buy",
												children: "فقط خرید"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "sell",
												children: "فقط فروش"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "پایبندی به پلن" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: plan,
										onValueChange: (v) => setPlan(v),
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
												children: "طبق پلن"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "no",
												children: "خارج از پلن"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نتیجه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: result,
										onValueChange: (v) => setResult(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-secondary/60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "all",
												children: "همه"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "win",
												children: "فقط برنده"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "loss",
												children: "فقط بازنده"
											})
										] })]
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
									setSide("all");
									setPlan("all");
									setResult("all");
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
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "شناسه"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "نماد"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "نوع"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "ورود"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "خروج"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "حجم"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "R:R"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "سود/زیان"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "پلن"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 text-right font-medium",
								children: "تاریخ"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/50 hover:bg-secondary/30 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 text-xs tabular text-muted-foreground",
								children: t.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 font-medium",
								children: t.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: t.side === "buy" ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive",
									children: t.side === "buy" ? "خرید" : "فروش"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 tabular",
								children: t.entry
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 tabular",
								children: t.exit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 tabular",
								children: t.volume
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 tabular",
								children: t.rr
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: `py-3 tabular font-medium ${t.pnl >= 0 ? "gain" : "loss"}`,
								children: [
									t.pnl >= 0 ? "+" : "",
									"$",
									t.pnl
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3",
								children: t.followedPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 text-xs text-muted-foreground tabular",
								children: t.date
							})
						]
					}, t.id)) })]
				})
			})]
		})
	});
}
//#endregion
export { TradesPage as component };
