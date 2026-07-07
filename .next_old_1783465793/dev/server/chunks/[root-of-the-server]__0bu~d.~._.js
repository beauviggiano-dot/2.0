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
"[project]/app/discover/route.ts [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/discover/route.ts', file not found");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0bu~d.~._.js.map