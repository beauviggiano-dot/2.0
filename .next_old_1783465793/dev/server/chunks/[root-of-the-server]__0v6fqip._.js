module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo-experimental.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo-experimental.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo-experimental.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo-experimental.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo-experimental.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo-experimental.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo-experimental.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo-experimental.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/lib/whop-app.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWhopConfig",
    ()=>getWhopConfig,
    "resolveAccess",
    ()=>resolveAccess
]);
// Embedded-app authentication for Whop.
//
// When TradeSafe runs *inside* Whop (an "embedded app" in an iframe), Whop's
// reverse proxy injects a signed `x-whop-user-token` header on EVERY request.
// We verify that token (its signature is checked against Whop's public JWKS)
// to identify the visitor, then confirm they own the required product/access
// pass. There is no login button, redirect, or OAuth consent screen — the whole
// point of an embedded app is that Whop has already authenticated the user.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$whop$2b$api$40$0$2e$0$2e$51_$40$auth$2b$core$40$0$2e$40$2e$0$2f$node_modules$2f40$whop$2f$api$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@whop+api@0.0.51_@auth+core@0.40.0/node_modules/@whop/api/dist/index.node.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$whop$2b$api$40$0$2e$0$2e$51_$40$auth$2b$core$40$0$2e$40$2e$0$2f$node_modules$2f40$whop$2f$api$2f$dist$2f$chunk$2d$Y2CEOSBS$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@whop+api@0.0.51_@auth+core@0.40.0/node_modules/@whop/api/dist/chunk-Y2CEOSBS.mjs [app-route] (ecmascript)");
;
function getWhopConfig() {
    const appId = ("TURBOPACK compile-time value", "app_F3Topgnu7WvXCP");
    const appApiKey = process.env.WHOP_API_KEY;
    // The product / access pass the visitor must own (prod_... or pass_...).
    const productId = process.env.WHOP_PRODUCT_ID;
    const checkoutUrl = process.env.WHOP_CHECKOUT_URL || null;
    const missing = [];
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!appApiKey) missing.push("WHOP_API_KEY");
    if (!productId) missing.push("WHOP_PRODUCT_ID");
    return {
        appId,
        appApiKey,
        productId,
        checkoutUrl,
        missing
    };
}
async function resolveAccess(headerList) {
    const { appId, appApiKey, productId, missing } = getWhopConfig();
    if (missing.length) {
        return {
            state: "error",
            detail: `Whop is not configured. Missing: ${missing.join(", ")}.`
        };
    }
    // Diagnostic: list any Whop-injected headers so we can tell whether Whop's
    // proxy is actually forwarding the auth token to this app.
    const whopHeaders = [
        ...headerList.keys()
    ].filter((k)=>k.startsWith("x-whop"));
    const headerSummary = whopHeaders.length ? whopHeaders.join(", ") : "none";
    const appIdHint = appId ? `${appId.slice(0, 10)}…` : "unset";
    // 1. Verify the Whop-injected user token. `dontThrow` makes it return null
    //    (instead of throwing) when the header is absent or the token is invalid,
    //    which is exactly what happens if someone opens the app outside Whop.
    const token = headerList.get("x-whop-user-token");
    if (!token) {
        return {
            state: "no_token",
            detail: `No x-whop-user-token header. Whop headers seen: ${headerSummary}. App: ${appIdHint}`
        };
    }
    let userId = null;
    try {
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$whop$2b$api$40$0$2e$0$2e$51_$40$auth$2b$core$40$0$2e$40$2e$0$2f$node_modules$2f40$whop$2f$api$2f$dist$2f$chunk$2d$Y2CEOSBS$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyUserToken"])(token, {
            appId: appId,
            dontThrow: true
        });
        userId = payload?.userId ?? null;
    } catch (err) {
        console.log("[v0] verifyUserToken failed:", err instanceof Error ? err.message : err);
        userId = null;
    }
    if (!userId) {
        return {
            state: "no_token",
            detail: `Token present but failed verification (app ${appIdHint}). Check NEXT_PUBLIC_WHOP_APP_ID matches the installed app.`
        };
    }
    // 2. Check the user owns the required product using the app's API key.
    try {
        const whop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$whop$2b$api$40$0$2e$0$2e$51_$40$auth$2b$core$40$0$2e$40$2e$0$2f$node_modules$2f40$whop$2f$api$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WhopServerSdk"])({
            appId: appId,
            appApiKey: appApiKey
        });
        const result = await whop.access.checkIfUserHasAccessToAccessPass({
            accessPassId: productId,
            userId
        });
        if (result?.hasAccess) return {
            state: "ok",
            userId
        };
        return {
            state: "no_access",
            userId,
            detail: `User ${userId} lacks access to ${productId}.`
        };
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        console.log("[v0] access check failed:", detail);
        return {
            state: "error",
            detail
        };
    }
}
}),
"[project]/lib/serve-app.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "serveTradeSafe",
    ()=>serveTradeSafe
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whop$2d$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/whop-app.ts [app-route] (ecmascript)");
;
;
;
async function serveTradeSafe(headerList) {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whop$2d$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveAccess"])(headerList);
    if (result.state === "ok") {
        const html = await buildAppHtml();
        return new Response(html, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store"
            }
        });
    }
    return new Response(gateHtml(result), {
        status: result.state === "error" ? 500 : 403,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}
// Read the private app files and inline the JS bundle into the HTML so the
// whole app is delivered in one authenticated response (no separate, ungated
// script request).
async function buildAppHtml() {
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "private");
    const [html, js] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, "tradesafe.html"), "utf8"),
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, "tradesafe.js"), "utf8")
    ]);
    const safeJs = js.replace(/<\/script>/gi, "<\\/script>");
    return html.replace(/<script src="\/app\/script[^"]*"><\/script>/, `<script>\n${safeJs}\n</script>`);
}
// A small, self-contained members-only / error page in the TradeSafe look.
function gateHtml(result) {
    const { checkoutUrl } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$whop$2d$app$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWhopConfig"])();
    let heading = "Members only";
    let body = "Access to TradeSafe is restricted to active members.";
    let cta = "";
    if (result.state === "no_token") {
        heading = "Open TradeSafe inside Whop";
        body = "This app runs inside your Whop. Open it from your Whop dashboard or product page to get instant access — there is no separate login.";
    } else if (result.state === "no_access") {
        heading = "You don't have access yet";
        body = "You're signed in to Whop, but your account doesn't have an active TradeSafe membership. Grab access to unlock the full workspace.";
        if (checkoutUrl) {
            cta = `<a class="btn" href="${escapeHtml(checkoutUrl)}" target="_top">Get access</a>`;
        }
    } else if (result.state === "error") {
        heading = "Something went wrong";
        body = "We couldn't verify your access. Please refresh, or contact support if this continues.";
    }
    const detailText = "detail" in result ? result.detail : "";
    const detail = detailText ? `<p class="detail">${escapeHtml(detailText)}</p>` : "";
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TradeSafe</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0E1116; color: #E5E9EF; padding: 24px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  .card { width: 100%; max-width: 420px; text-align: center; }
  .brand { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
  .bar { height: 36px; width: 10px; border-radius: 3px; background: #D4A24C; }
  .brand-name { font-size: 24px; font-weight: 700; letter-spacing: 0.02em; }
  h1 { font-size: 20px; font-weight: 600; line-height: 1.5; margin: 0 0 12px; }
  p { font-size: 14px; line-height: 1.6; color: #8B93A1; margin: 0 auto; max-width: 34ch; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; width: 100%;
    margin-top: 28px; padding: 13px 20px; border-radius: 10px; background: #D4A24C;
    color: #14110A; font-weight: 600; text-decoration: none; transition: filter .15s ease;
  }
  .btn:hover { filter: brightness(1.08); }
  .detail {
    margin-top: 22px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px; color: #7B93A1; background: #131820; border: 1px solid #232A33;
    border-radius: 8px; padding: 10px 12px; word-break: break-word; max-width: none;
  }
  .footer { margin-top: 40px; font-size: 12px; color: #5A626E; }
</style>
</head>
<body>
  <main class="card">
    <div class="brand"><span class="bar" aria-hidden="true"></span><span class="brand-name">TradeSafe</span></div>
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(body)}</p>
    ${cta}
    ${detail}
    <p class="footer">Powered by Whop</p>
  </main>
</body>
</html>`;
}
function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
}),
"[project]/app/route.ts [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/route.ts', file not found");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0v6fqip._.js.map