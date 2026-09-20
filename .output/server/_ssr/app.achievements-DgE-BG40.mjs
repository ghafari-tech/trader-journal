import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Badge } from "./badge-DHlcf1ty.mjs";
import { T as Lock, c as Trophy } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-saF5BTPQ.mjs";
import { t as achievements } from "./mock-data-BnneBzB8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.achievements-DgE-BG40.js
var import_jsx_runtime = require_jsx_runtime();
function AchievementsPage() {
	const earned = achievements.filter((a) => a.earned).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "نشان‌ها",
		subtitle: `${earned} از ${achievements.length} نشان کسب‌شده`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: achievements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card-surface p-6 text-center transition-all ${a.earned ? "hover:border-primary/40" : "opacity-60"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mx-auto grid h-16 w-16 place-items-center rounded-2xl ${a.earned ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[var(--shadow-glow)]" : "bg-secondary text-muted-foreground"}`,
						children: a.earned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-7 w-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-semibold",
						children: a.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: a.desc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: `mt-4 ${a.earned ? "border-primary/40 bg-primary/10 text-primary" : ""}`,
						children: a.earned ? "کسب‌شده" : "قفل"
					})
				]
			}, a.id))
		})
	});
}
//#endregion
export { AchievementsPage as component };
