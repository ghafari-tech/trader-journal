import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { B as ChevronLeft, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-saF5BTPQ.mjs";
import { r as calendarDays } from "./mock-data-BnneBzB8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.calendar-B8RWDuaZ.js
var import_jsx_runtime = require_jsx_runtime();
var weekdays = [
	"ش",
	"ی",
	"د",
	"س",
	"چ",
	"پ",
	"ج"
];
function CalendarPage() {
	const totalPnl = calendarDays.reduce((s, d) => s + d.pnl, 0);
	const winDays = calendarDays.filter((d) => d.day && d.pnl > 0).length;
	const loseDays = calendarDays.filter((d) => d.day && d.pnl < 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "تقویم معاملاتی",
		subtitle: "نقشه رنگی روزهای سودده و زیان‌ده — آبان ۱۴۰۳",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-24 text-center font-medium",
					children: "آبان ۱۴۰۳"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
				})
			]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "مجموع ماه"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-2 text-2xl font-bold tabular ${totalPnl >= 0 ? "gain" : "loss"}`,
						children: [
							totalPnl >= 0 ? "+" : "",
							"$",
							totalPnl.toFixed(0)
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "روزهای سودده"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-bold tabular gain",
						children: winDays
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "روزهای زیان‌ده"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-bold tabular loss",
						children: loseDays
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "بهترین روز"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-2xl font-bold tabular gain",
						children: ["+$", Math.max(...calendarDays.map((d) => d.pnl)).toFixed(0)]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-surface mt-6 p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-2",
				children: [weekdays.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pb-2 text-center text-xs font-medium text-muted-foreground",
					children: w
				}, w)), calendarDays.map((c, i) => {
					if (!c.day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square" }, i);
					const intensity = Math.min(Math.abs(c.pnl) / 800, 1);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "aspect-square rounded-lg border border-border p-2 transition-all hover:scale-105 hover:border-primary/50",
						style: { background: c.pnl > 0 ? `oklch(0.4 ${.1 * intensity + .05} 155 / ${.3 + intensity * .5})` : c.pnl < 0 ? `oklch(0.4 ${.15 * intensity + .05} 25 / ${.3 + intensity * .5})` : "oklch(0.22 0.02 255)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-foreground/80 tabular",
							children: c.day
						}), c.pnl !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mt-2 text-xs font-bold tabular ${c.pnl > 0 ? "gain" : "loss"}`,
							children: [
								c.pnl > 0 ? "+" : "",
								"$",
								c.pnl
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 text-[10px] text-muted-foreground",
							children: [c.trades, " معامله"]
						})] })]
					}, i);
				})]
			})
		})]
	});
}
//#endregion
export { CalendarPage as component };
