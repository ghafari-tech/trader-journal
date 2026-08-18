import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BpE9Czok.mjs";
import { t as Input } from "./input-NvmijQlt.mjs";
import { t as Badge } from "./badge-DHlcf1ty.mjs";
import { E as Link2, L as CircleCheck, N as CreditCard, X as Bell, a as User } from "../_libs/lucide-react.mjs";
import { n as Avatar, r as AvatarFallback, t as AppShell } from "./AppShell-saF5BTPQ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DO3DZj4v.mjs";
import { t as Label } from "./label-AutfcB-T.mjs";
import { t as Switch } from "./switch-Cp8Exbjp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.settings-ZUZrabfk.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "تنظیمات",
		subtitle: "مدیریت حساب، اشتراک و اتصالات",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "profile",
			dir: "rtl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "profile",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "ml-1 h-4 w-4" }), "پروفایل"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "subscription",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "ml-1 h-4 w-4" }), "اشتراک"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "mt",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "ml-1 h-4 w-4" }), "متاتریدر"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "notifications",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "ml-1 h-4 w-4" }), "اعلان‌ها"]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "profile",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "h-16 w-16",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-primary/20 text-lg font-bold text-primary",
											children: "ع.ر"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "علی رضایی"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "ali@example.com"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "mr-auto",
										children: "تغییر عکس"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نام" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: "علی",
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نام خانوادگی" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: "رضایی",
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ایمیل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: "ali@example.com",
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "موبایل" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: "09123456789",
											className: "bg-secondary/60 tabular"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "bg-primary text-primary-foreground hover:bg-primary/90",
									children: "ذخیره تغییرات"
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "subscription",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface p-6 lg:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "اشتراک فعلی"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-2xl font-bold",
										children: "Pro Max"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-primary text-primary-foreground",
										children: "فعال"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid gap-4 sm:grid-cols-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "شروع"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 tabular",
											children: "۱۴۰۳/۰۷/۰۱"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "پایان"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 tabular",
											children: "۱۴۰۳/۰۸/۰۱"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "مبلغ ماهانه"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 tabular",
											children: "۲,۰۰۰,۰۰۰ تومان"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "bg-primary text-primary-foreground hover:bg-primary/90",
										children: "تمدید اشتراک"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										children: "مشاهده فاکتورها"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: "کد تخفیف"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "کد را وارد کنید",
										className: "bg-secondary/60"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										children: "اعمال"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-lg bg-primary/10 p-3 text-sm text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "ml-1 inline h-4 w-4" }), "پرداخت از طریق زرین‌پال"]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "mt",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "اتصال حساب متاتریدر"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "معاملات از MT4/MT5 به‌صورت خودکار همگام می‌شوند."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نسخه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: "MT5",
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "سرور" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "ICMarkets-Live01",
											className: "bg-secondary/60"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "شماره حساب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "12345678",
											className: "bg-secondary/60 tabular"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "رمز Investor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "password",
											className: "bg-secondary/60"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "bg-primary text-primary-foreground hover:bg-primary/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "ml-1 h-4 w-4" }), "اتصال"]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "notifications",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-surface space-y-4 p-6",
						children: [
							{
								t: "یادآوری ثبت ژورنال",
								d: "شب‌ها اگر ژورنال ثبت نشده باشد یادآوری کن."
							},
							{
								t: "هشدار نزدیک شدن به سقف ریسک",
								d: "وقتی ۸۰٪ ضرر روزانه رخ داد."
							},
							{
								t: "گزارش هفتگی AI",
								d: "خلاصه عملکرد هفتگی به ایمیل ارسال شود."
							},
							{
								t: "رفتار غیرعادی معاملاتی",
								d: "شناسایی FOMO یا Revenge Trading."
							}
						].map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-secondary/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: n.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: n.d
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { defaultChecked: i < 3 })]
						}, i))
					})
				})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
