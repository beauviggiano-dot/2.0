import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

// ForexFactory's official weekly JSON feed (no key required). We sync the
// current week into the DB on each request, so history accumulates over time
// and past/monthly views can be served from the database.
const FF_FEED = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"

type FeedItem = {
  title: string
  country: string
  date: string
  impact: string
  forecast: string
  previous: string
}

type EventRow = {
  id: string
  title: string
  country: string
  currency: string | null
  event_date: string
  event_day: string
  impact: string
  all_day: boolean
  forecast: string | null
  previous: string | null
  actual: string | null
}

// Normalize FF impact labels to our four folders.
function normImpact(raw: string): string {
  const s = (raw || "").toLowerCase()
  if (s.includes("high")) return "high"
  if (s.includes("medium")) return "medium"
  if (s.includes("low")) return "low"
  if (s.includes("holiday")) return "holiday"
  return "low"
}

// Deterministic natural key so re-syncing the same event updates it in place.
function eventId(it: FeedItem): string {
  const slug = `${it.date}|${it.country}|${it.title}`
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0
  return `ff_${(hash >>> 0).toString(36)}`
}

// Pull the current week from the feed and upsert into the DB.
async function syncCurrentWeek(): Promise<void> {
  const res = await fetch(FF_FEED, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`feed ${res.status}`)
  const items = (await res.json()) as FeedItem[]
  if (!Array.isArray(items) || !items.length) return

  for (const it of items) {
    const impact = normImpact(it.impact)
    const id = eventId(it)
    const day = it.date.slice(0, 10) // calendar day in the feed's ET offset
    const isHoliday = impact === "holiday"
    await sql`
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
    `
  }
}

// GET /api/calendar?month=YYYY-MM  (defaults to current month, UTC)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get("month") // "YYYY-MM"

  let syncError: string | null = null
  try {
    await syncCurrentWeek()
  } catch (err) {
    // Non-fatal: still serve whatever history is already stored.
    syncError = err instanceof Error ? err.message : "sync failed"
  }

  // Resolve the month window (first day .. first day of next month).
  const now = new Date()
  const [y, m] = month
    ? (month.split("-").map(Number) as [number, number])
    : [now.getUTCFullYear(), now.getUTCMonth() + 1]
  const start = `${y}-${String(m).padStart(2, "0")}-01`
  const nextM = m === 12 ? 1 : m + 1
  const nextY = m === 12 ? y + 1 : y
  const end = `${nextY}-${String(nextM).padStart(2, "0")}-01`

  const rows = (await sql`
    SELECT id, title, country, currency, event_date, event_day, impact, all_day, forecast, previous, actual
    FROM calendar_events
    WHERE event_day >= ${start} AND event_day < ${end}
    ORDER BY event_date ASC
  `) as EventRow[]

  const events = rows.map((r) => ({
    id: r.id,
    title: r.title,
    currency: r.currency || r.country,
    date: typeof r.event_date === "string" ? r.event_date : new Date(r.event_date).toISOString(),
    day:
      typeof r.event_day === "string"
        ? r.event_day.slice(0, 10)
        : new Date(r.event_day).toISOString().slice(0, 10),
    impact: r.impact,
    allDay: r.all_day,
    forecast: r.forecast,
    previous: r.previous,
    actual: r.actual,
  }))

  return NextResponse.json({
    source: "forexfactory-weekly+db",
    month: `${y}-${String(m).padStart(2, "0")}`,
    count: events.length,
    syncError,
    events,
  })
}
