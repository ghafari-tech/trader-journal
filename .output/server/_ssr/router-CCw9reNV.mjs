import { _ as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CCw9reNV.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DiD70d0w.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dark flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "۴۰۴"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "صفحه پیدا نشد"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "بازگشت به خانه"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dark flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "این صفحه بارگذاری نشد"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "مشکلی پیش آمد. می‌توانید دوباره تلاش کنید یا به صفحه اصلی بازگردید."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "تلاش دوباره"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
						children: "بازگشت به خانه"
					})]
				})
			]
		})
	});
}
var Route$16 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "TraderJournal AI — ژورنال هوشمند معامله‌گران" },
			{
				name: "description",
				content: "پلتفرم حرفه‌ای ژورنال‌نویسی معامله‌گران بازارهای مالی با تحلیل هوش مصنوعی، مدیریت ریسک و اتصال مستقیم به متاتریدر."
			},
			{
				property: "og:title",
				content: "TraderJournal AI — ژورنال هوشمند معامله‌گران"
			},
			{
				property: "og:description",
				content: "ژورنال‌نویسی، تحلیل عملکرد و مربی هوشمند معامله‌گری در یک پلتفرم."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fa",
		dir: "rtl",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground antialiased",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$16.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$15 = () => import("./signup-CA1nNvPr.mjs");
var Route$15 = createFileRoute("/signup")({
	head: () => ({ meta: [{ title: "ثبت‌نام — TraderJournal AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./login-BpP0bQKf.mjs");
var Route$14 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "ورود — TraderJournal AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./app-DpnSEiVG.mjs");
var Route$13 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./routes-gFOt0pUe.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "TraderJournal AI — ژورنال هوشمند معامله‌گران بازارهای مالی" }, {
		name: "description",
		content: "ثبت معاملات، تحلیل روانشناسی، مدیریت ریسک و مربی هوشمند برای معامله‌گران فارکس، کریپتو و شاخص‌ها."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./app.trades-8jw1dHgN.mjs");
var Route$11 = createFileRoute("/app/trades")({
	head: () => ({ meta: [{ title: "معاملات" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./app.settings-ZUZrabfk.mjs");
var Route$10 = createFileRoute("/app/settings")({
	head: () => ({ meta: [{ title: "تنظیمات" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./app.risk-CsGwxvr5.mjs");
var Route$9 = createFileRoute("/app/risk")({
	head: () => ({ meta: [{ title: "مدیریت ریسک" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./app.portfolios-CdZ96lNC.mjs");
var Route$8 = createFileRoute("/app/portfolios")({
	head: () => ({ meta: [{ title: "پرتفولیوها" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./app.journal-B_QKR1Pz.mjs");
var Route$7 = createFileRoute("/app/journal")({
	head: () => ({ meta: [{ title: "ژورنال" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./app.goals-C-3NetY_.mjs");
var Route$6 = createFileRoute("/app/goals")({
	head: () => ({ meta: [{ title: "اهداف معاملاتی" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./app.dashboard-A3qSgSs0.mjs");
var Route$5 = createFileRoute("/app/dashboard")({
	head: () => ({ meta: [{ title: "داشبورد — TraderJournal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./app.calendar-B8RWDuaZ.mjs");
var Route$4 = createFileRoute("/app/calendar")({
	head: () => ({ meta: [{ title: "تقویم معاملاتی" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./app.ai-coach-DnSTvgM7.mjs");
var Route$3 = createFileRoute("/app/ai-coach")({
	head: () => ({ meta: [{ title: "مربی هوشمند" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./app.admin-DkgvSb31.mjs");
var Route$2 = createFileRoute("/app/admin")({
	head: () => ({ meta: [{ title: "پنل مدیریت" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./app.achievements-DgE-BG40.mjs");
var Route$1 = createFileRoute("/app/achievements")({
	head: () => ({ meta: [{ title: "نشان‌ها" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./app.trades.new-D7-0-Wxt.mjs");
var Route = createFileRoute("/app/trades/new")({
	head: () => ({ meta: [{ title: "معامله جدید" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SignupRoute = Route$15.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$16
});
var LoginRoute = Route$14.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$16
});
var AppRoute = Route$13.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$16
});
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$16
});
var AppTradesRoute = Route$11.update({
	id: "/trades",
	path: "/trades",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$10.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppRiskRoute = Route$9.update({
	id: "/risk",
	path: "/risk",
	getParentRoute: () => AppRoute
});
var AppPortfoliosRoute = Route$8.update({
	id: "/portfolios",
	path: "/portfolios",
	getParentRoute: () => AppRoute
});
var AppJournalRoute = Route$7.update({
	id: "/journal",
	path: "/journal",
	getParentRoute: () => AppRoute
});
var AppGoalsRoute = Route$6.update({
	id: "/goals",
	path: "/goals",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$5.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppCalendarRoute = Route$4.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AppRoute
});
var AppAiCoachRoute = Route$3.update({
	id: "/ai-coach",
	path: "/ai-coach",
	getParentRoute: () => AppRoute
});
var AppAdminRoute = Route$2.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AppRoute
});
var AppAchievementsRoute = Route$1.update({
	id: "/achievements",
	path: "/achievements",
	getParentRoute: () => AppRoute
});
var AppTradesRouteChildren = { AppTradesNewRoute: Route.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AppTradesRoute
}) };
var AppRouteChildren = {
	AppAchievementsRoute,
	AppAdminRoute,
	AppAiCoachRoute,
	AppCalendarRoute,
	AppDashboardRoute,
	AppGoalsRoute,
	AppJournalRoute,
	AppPortfoliosRoute,
	AppRiskRoute,
	AppSettingsRoute,
	AppTradesRoute: AppTradesRoute._addFileChildren(AppTradesRouteChildren)
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	SignupRoute
};
var routeTree = Route$16._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
