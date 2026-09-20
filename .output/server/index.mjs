globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as NodeResponse, i as defineLazyEventHandler, l as serve, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-31T03:19:07.953Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/AppShell-bm49qS1R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a078-FE7HiUrRiA4wXMGAgSXyT/+B/Vg\"",
		"mtime": "2026-07-31T03:19:06.864Z",
		"size": 106616,
		"path": "../public/assets/AppShell-bm49qS1R.js"
	},
	"/assets/BarChart-Dg2txb-U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5afb3-hmdyqiDA1zkRnj+VIkz35cxKZpA\"",
		"mtime": "2026-07-31T03:19:06.864Z",
		"size": 372659,
		"path": "../public/assets/BarChart-Dg2txb-U.js"
	},
	"/assets/activity-CUwjCbab.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e0-cW3L4HqNMFaf6E3tV0Taw4OKcn0\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 224,
		"path": "../public/assets/activity-CUwjCbab.js"
	},
	"/assets/app-CBGDGUqO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-K89Ax0cUnQpweEWd+p65aO1XjBk\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 138,
		"path": "../public/assets/app-CBGDGUqO.js"
	},
	"/assets/app.admin-B56bHXtP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2154-+s2YtElr1ejizTTVDxZG9MFljAs\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 8532,
		"path": "../public/assets/app.admin-B56bHXtP.js"
	},
	"/assets/app.achievements-Cx-WFhtm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57d-tGGqmAVLOsmNBTQPUQpsueZApcg\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 1405,
		"path": "../public/assets/app.achievements-Cx-WFhtm.js"
	},
	"/assets/app.ai-coach-B3tWp61f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3113-4zs9YAtx4O/b9TDxv8u2lzMonew\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 12563,
		"path": "../public/assets/app.ai-coach-B3tWp61f.js"
	},
	"/assets/app.calendar-BRCU8lMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bf9-/soW2FgVSRX/RJ5k04EYLQG3fT0\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 3065,
		"path": "../public/assets/app.calendar-BRCU8lMC.js"
	},
	"/assets/app.dashboard-RH4gY3OI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df92-AvZ/trZxICIx42fuyJinm252A3s\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 57234,
		"path": "../public/assets/app.dashboard-RH4gY3OI.js"
	},
	"/assets/app.goals-B4-F5gEy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e99-5MBlWJe0SjQhSW40lXHff5sh4iY\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 3737,
		"path": "../public/assets/app.goals-B4-F5gEy.js"
	},
	"/assets/app.journal-D3cGCOGL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21b9-uiwJQbE263ksQmNv58vQk0Yfv18\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 8633,
		"path": "../public/assets/app.journal-D3cGCOGL.js"
	},
	"/assets/app.portfolios-DIxMWeUg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b5c-PL/fkpxYpULGRJ4wfUOJpLs0w9o\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 7004,
		"path": "../public/assets/app.portfolios-DIxMWeUg.js"
	},
	"/assets/app.risk-eEc0vYTG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc7-RZRbCzrLJwz4BFYvfsRvRXUXUc8\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 3015,
		"path": "../public/assets/app.risk-eEc0vYTG.js"
	},
	"/assets/app.settings-D0XO2Hud.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b05-0hrd5Bud4TPtPYYjTH5xMtuQ7MM\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 6917,
		"path": "../public/assets/app.settings-D0XO2Hud.js"
	},
	"/assets/app.trades-CIvHeiLs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1895-UuEXmcNBunhtl8pDQ6PiZroPFBk\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 6293,
		"path": "../public/assets/app.trades-CIvHeiLs.js"
	},
	"/assets/app.trades.new-DFZuG2F9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1813-7ziBndE9pnm6ZUgIxsV4pXPqZdk\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 6163,
		"path": "../public/assets/app.trades.new-DFZuG2F9.js"
	},
	"/assets/arrow-left-BHQ7tAQc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b-XHBectZQurkZfdggcClxAuiY+Ww\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 155,
		"path": "../public/assets/arrow-left-BHQ7tAQc.js"
	},
	"/assets/badge-Dq10kvxp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7e8-8flofxdsvNPV3tgzMuz8f4VanMY\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 2024,
		"path": "../public/assets/badge-Dq10kvxp.js"
	},
	"/assets/brain-3-DOcR9Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"237-NmLEWMN/PYvMzJkxq9tpOarsmvk\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 567,
		"path": "../public/assets/brain-3-DOcR9Q.js"
	},
	"/assets/button-CtH7OQbr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b63-usf/bihGDSmegJvWwnotR7qe6CA\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 31587,
		"path": "../public/assets/button-CtH7OQbr.js"
	},
	"/assets/circle-check-BUOWZDps.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8-OgYNVAsmOhJN2xH5zDX0ujnnHvI\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 168,
		"path": "../public/assets/circle-check-BUOWZDps.js"
	},
	"/assets/cpu-D-XHQShd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"278-RVm1VvqzydBoYqw3MmuTHT4C7a0\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 632,
		"path": "../public/assets/cpu-D-XHQShd.js"
	},
	"/assets/credit-card-C1jL5ang.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c5-QCtHwAKNCewIe6TKRM3LLOEzOeg\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 197,
		"path": "../public/assets/credit-card-C1jL5ang.js"
	},
	"/assets/dialog-CJg0qCNO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"847-oAUZwmJcQ0TZXTUuMvQdEjc+b8Q\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 2119,
		"path": "../public/assets/dialog-CJg0qCNO.js"
	},
	"/assets/dist-CmuXr8dG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fe-nSBz8TTIXj7mrlY6lauHtD6qD/k\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 254,
		"path": "../public/assets/dist-CmuXr8dG.js"
	},
	"/assets/ellipsis-vertical-WHH_yLHS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1-LapecEGsYt1hPwEYmzEJ+0Guocc\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 225,
		"path": "../public/assets/ellipsis-vertical-WHH_yLHS.js"
	},
	"/assets/funnel-DMjF2OUt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"190-itorXAhYYEAXDEAHCbp1cEIuXAI\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 400,
		"path": "../public/assets/funnel-DMjF2OUt.js"
	},
	"/assets/input-B2WgHlOn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26b-Qatm45u2A7p4FhSlC4+RVBpIC48\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 619,
		"path": "../public/assets/input-B2WgHlOn.js"
	},
	"/assets/label-BCYA5PCA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3dc-S4MwV82jCfB7j8vxyhZokcP1HDE\"",
		"mtime": "2026-07-31T03:19:06.865Z",
		"size": 988,
		"path": "../public/assets/label-BCYA5PCA.js"
	},
	"/assets/link-2-BXxlGUA7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-Fy1y3j7ndAQ876czmvjeJ/acVSk\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 232,
		"path": "../public/assets/link-2-BXxlGUA7.js"
	},
	"/assets/login-DabG0qRp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"917-HgPsVHXZTX5wVpPsR52IFb/S3x8\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 2327,
		"path": "../public/assets/login-DabG0qRp.js"
	},
	"/assets/mock-data-CPpuo91u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e2c-wGhELrB25NZ1DIhixGnKjZ33CHQ\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 11820,
		"path": "../public/assets/mock-data-CPpuo91u.js"
	},
	"/assets/progress-C2Skmi9l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cee-xscWgcwVK6ZGmyCuDaPb/4rjkCo\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 3310,
		"path": "../public/assets/progress-C2Skmi9l.js"
	},
	"/assets/routes-DYMXMS8P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4608-JhFw6/ZN3QCbEKmDIz7PQhbfIgg\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 17928,
		"path": "../public/assets/routes-DYMXMS8P.js"
	},
	"/assets/select-CV8SWkYG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57f9-Uu0VF15r5vRdD5J6BxFNB77bo74\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 22521,
		"path": "../public/assets/select-CV8SWkYG.js"
	},
	"/assets/shield-BPDWg5f9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-ot1qH2tzXA0RJBo5lZewiMymNbU\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 262,
		"path": "../public/assets/shield-BPDWg5f9.js"
	},
	"/assets/signup-BFlyItJ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c9f-uDYq6i62iWVGUmR4wrh4pkKY2qw\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 3231,
		"path": "../public/assets/signup-BFlyItJ1.js"
	},
	"/assets/index-BwKqOHAy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56fd6-svpl/N0zmZOikhyhvblSkzuPzEc\"",
		"mtime": "2026-07-31T03:19:06.864Z",
		"size": 356310,
		"path": "../public/assets/index-BwKqOHAy.js"
	},
	"/assets/styles-DiD70d0w.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16088-LcXr/wp/KctS51O+FBKSQ3O+THk\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 90248,
		"path": "../public/assets/styles-DiD70d0w.css"
	},
	"/assets/switch-CZ0tUm0s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1d-5QPC9IsllbqSNrysriyxOPa5LLE\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 2589,
		"path": "../public/assets/switch-CZ0tUm0s.js"
	},
	"/assets/tabs-gXQb0hpv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0c-5IctNCg8QvzMlU73yBkUTNOwcQM\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 3340,
		"path": "../public/assets/tabs-gXQb0hpv.js"
	},
	"/assets/textarea-DT58Ix6I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"205-fdVYSwIVDyJ/85Cns2PPY8vgomY\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 517,
		"path": "../public/assets/textarea-DT58Ix6I.js"
	},
	"/assets/trending-up-d998o7EF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-nyWocm3r2yQeXLGNLOj9HDBes8Y\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 165,
		"path": "../public/assets/trending-up-d998o7EF.js"
	},
	"/assets/useStore-D5ySuto1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bd9-oeMZK0ThS4hegiT16+9KQ85tHzY\"",
		"mtime": "2026-07-31T03:19:06.866Z",
		"size": 27609,
		"path": "../public/assets/useStore-D5ySuto1.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_cLJC3H = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_cLJC3H
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
