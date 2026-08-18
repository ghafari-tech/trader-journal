import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
import { t as Badge } from "./badge-DHlcf1ty.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as EllipsisVertical, E as Link2, b as Plus, nt as Archive, p as SquarePen, r as Wallet } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-saF5BTPQ.mjs";
import { u as portfolios } from "./mock-data-BnneBzB8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.mjs";
import { t as Label } from "./label-AutfcB-T.mjs";
import { a as DialogFooter, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogHeader, r as DialogContent, s as DialogTitle, t as Dialog } from "./dialog-DfkAzG_d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.portfolios-CdZ96lNC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Portfolios() {
	const [portfolios$1, setPortfolios] = (0, import_react.useState)(portfolios);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [broker, setBroker] = (0, import_react.useState)("");
	const [balance, setBalance] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [leverage, setLeverage] = (0, import_react.useState)("1:100");
	function submit(e) {
		e.preventDefault();
		if (!name.trim() || !broker.trim()) {
			toast.error("نام و بروکر الزامی است");
			return;
		}
		const initial = Number(balance) || 0;
		setPortfolios((p) => [...p, {
			id: `P${p.length + 1}`,
			name: name.trim(),
			broker: broker.trim(),
			type: "استاندارد",
			balance: initial,
			initial,
			leverage,
			currency,
			trades: 0,
			status: "فعال"
		}]);
		toast.success(`پرتفولیو «${name.trim()}» ساخته شد`);
		setName("");
		setBroker("");
		setBalance("");
		setCurrency("USD");
		setLeverage("1:100");
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "پرتفولیوها",
		subtitle: "مدیریت حساب‌های معاملاتی و اتصال به بروکرها",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "ml-1 h-4 w-4" }), "پرتفولیو جدید"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "پرتفولیو جدید" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "یک حساب معاملاتی جدید اضافه کن. بعداً می‌توانی به MT4/MT5 متصل کنی." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نام پرتفولیو" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "پرتفوی اصلی",
									className: "bg-secondary/60"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "بروکر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: broker,
									onChange: (e) => setBroker(e.target.value),
									placeholder: "IC Markets",
									className: "bg-secondary/60"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "موجودی اولیه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: balance,
									onChange: (e) => setBalance(e.target.value),
									className: "bg-secondary/60 tabular"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ارز" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: currency,
									onValueChange: setCurrency,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-secondary/60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"USD",
										"USDT",
										"EUR",
										"IRR"
									].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "لوریج" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: leverage,
									onValueChange: setLeverage,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-secondary/60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"1:1",
										"1:30",
										"1:100",
										"1:200",
										"1:500"
									].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: l,
										children: l
									}, l)) })]
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
							children: "ایجاد پرتفولیو"
						})]
					})
				]
			}) })]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: portfolios$1.map((p) => {
				const pnl = p.balance - p.initial;
				const pct = p.initial ? pnl / p.initial * 100 : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 transition-all hover:border-primary/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: p.broker
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								onClick: () => toast.info("منوی گزینه‌ها به‌زودی"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-secondary/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: "موجودی فعلی"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-lg font-bold tabular",
									children: ["$", p.balance.toLocaleString()]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-secondary/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: "سود / زیان"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `mt-1 text-lg font-bold tabular ${pnl >= 0 ? "gain" : "loss"}`,
									children: [
										pnl >= 0 ? "+" : "",
										"$",
										pnl.toLocaleString()
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-3 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "لوریج:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular",
										children: p.leverage
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "ارز:"
									}),
									" ",
									p.currency
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "معاملات:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular",
										children: p.trades
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: p.status === "فعال" ? "border-primary/40 bg-primary/10 text-primary" : "",
								children: p.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-sm font-medium tabular ${pct >= 0 ? "gain" : "loss"}`,
								children: [
									pct >= 0 ? "+" : "",
									pct.toFixed(2),
									"٪"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1",
									onClick: () => toast.success(`اتصال ${p.name} به متاتریدر شروع شد`),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "ml-1 h-3 w-3" }), "اتصال MT"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => toast.info("ویرایش به‌زودی"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3 w-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => toast.success(`${p.name} آرشیو شد`),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3 w-3" })
								})
							]
						})
					]
				}, p.id);
			})
		})
	});
}
//#endregion
export { Portfolios as component };
