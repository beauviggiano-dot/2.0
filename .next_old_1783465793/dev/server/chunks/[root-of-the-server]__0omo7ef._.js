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
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$neondatabase$2b$serverless$40$1$2e$1$2e$0$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@neondatabase+serverless@1.1.0/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$neondatabase$2b$serverless$40$1$2e$1$2e$0$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
}),
"[project]/app/api/calendar/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.29.7_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
const dynamic = "force-dynamic";
// ForexFactory's official weekly JSON feed (no key required). We sync the
// current week into the DB on each request, so history accumulates over time
// and past/monthly views can be served from the database.
const FF_FEED = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
// Normalize FF impact labels to our four folders.
function normImpact(raw) {
    const s = (raw || "").toLowerCase();
    if (s.includes("high")) return "high";
    if (s.includes("medium")) return "medium";
    if (s.includes("low")) return "low";
    if (s.includes("holiday")) return "holiday";
    return "low";
}
// Deterministic natural key so re-syncing the same event updates it in place.
function eventId(it) {
    const slug = `${it.date}|${it.country}|${it.title}`;
    let hash = 0;
    for(let i = 0; i < slug.length; i++)hash = hash * 31 + slug.charCodeAt(i) | 0;
    return `ff_${(hash >>> 0).toString(36)}`;
}
// Only refetch the upstream feed this often. The feed only holds the current
// week and changes infrequently, so hammering it on every request just gets us
// rate limited (HTTP 429). Everything else is served from the DB.
const SYNC_INTERVAL_MS = 15 * 60 * 1000 // 15 minutes
;
// In-memory guards to collapse bursts (e.g. the UI loading 3 months at once)
// within a single warm instance.
let lastSyncAt = 0;
let inFlight = null;
// Has the feed been synced recently enough (checked against the DB so the
// throttle survives cold starts and works across instances)?
async function isFresh() {
    if (Date.now() - lastSyncAt < SYNC_INTERVAL_MS) return true;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
    SELECT EXTRACT(EPOCH FROM MAX(updated_at)) * 1000 AS last_ms
    FROM calendar_events
  `;
    const lastMs = rows[0]?.last_ms ? Number(rows[0].last_ms) : 0;
    if (lastMs) lastSyncAt = lastMs;
    return Date.now() - lastMs < SYNC_INTERVAL_MS;
}
// Throttled entry point: skips the network call when data is still fresh and
// dedupes concurrent syncs within the same instance.
async function maybeSyncCurrentWeek() {
    if (await isFresh()) return;
    if (inFlight) return inFlight;
    inFlight = syncCurrentWeek().then(()=>{
        lastSyncAt = Date.now();
    }).finally(()=>{
        inFlight = null;
    });
    return inFlight;
}
// Pull the current week from the feed and upsert into the DB.
async function syncCurrentWeek() {
    const res = await fetch(FF_FEED, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json"
        },
        cache: "no-store"
    });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items) || !items.length) return;
    for (const it of items){
        const impact = normImpact(it.impact);
        const id = eventId(it);
        const day = it.date.slice(0, 10) // calendar day in the feed's ET offset
        ;
        const isHoliday = impact === "holiday";
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO calendar_events
        (id, title, country, currency, event_date, event_day, impact, all_day, forecast, previous, actual, updated_at)
      VALUES
        (${id}, ${it.title}, ${it.country}, ${it.country}, ${it.date}, ${day},
         ${impact}, ${isHoliday}, ${it.forecast || null}, ${it.previous || null}, NULL, now())
      ON CONFLICT (id) DO UPDATE SET
        forecast = EXCLUDED.forecast,
        previous = EXCLUDED.previous,
        impact = EXCLUDED.impact,
        updated_at = now()
    `;
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") // "YYYY-MM"
    ;
    let syncError = null;
    try {
        await maybeSyncCurrentWeek();
    } catch (err) {
        // Non-fatal: still serve whatever history is already stored.
        syncError = err instanceof Error ? err.message : "sync failed";
    }
    // Resolve the month window (first day .. first day of next month).
    const now = new Date();
    const [y, m] = month ? month.split("-").map(Number) : [
        now.getUTCFullYear(),
        now.getUTCMonth() + 1
    ];
    const start = `${y}-${String(m).padStart(2, "0")}-01`;
    const nextM = m === 12 ? 1 : m + 1;
    const nextY = m === 12 ? y + 1 : y;
    const end = `${nextY}-${String(nextM).padStart(2, "0")}-01`;
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
    SELECT id, title, country, currency, event_date, event_day, impact, all_day, forecast, previous, actual
    FROM calendar_events
    WHERE event_day >= ${start} AND event_day < ${end}
    ORDER BY event_date ASC
  `;
    const events = rows.map((r)=>({
            id: r.id,
            title: r.title,
            currency: r.currency || r.country,
            date: typeof r.event_date === "string" ? r.event_date : new Date(r.event_date).toISOString(),
            day: typeof r.event_day === "string" ? r.event_day.slice(0, 10) : new Date(r.event_day).toISOString().slice(0, 10),
            impact: r.impact,
            allDay: r.all_day,
            forecast: r.forecast,
            previous: r.previous,
            actual: r.actual
        }));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$29$2e$7_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        source: "forexfactory-weekly+db",
        month: `${y}-${String(m).padStart(2, "0")}`,
        count: events.length,
        syncError,
        events
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0omo7ef._.js.map