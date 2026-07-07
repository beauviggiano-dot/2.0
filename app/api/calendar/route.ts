import { NextResponse } from "next/server"

// ForexFactory embeds the full month of calendar data (past + future) in an
// inline `window.calendarComponentStates[...]` object on the calendar page.
// We scrape that, extract just the `days` array (whose elements are valid
// JSON), normalize it, and cache it. No API key required.

export const revalidate = 900 // 15 minutes

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

// Validate/normalize a `?month=` param like "jul.2026". Falls back to current month (ET).
function resolveMonth(raw: string | null): { param: string; monthIdx: number; year: number } {
  const m = raw?.trim().toLowerCase().match(/^([a-z]{3})\.(\d{4})$/)
  if (m && MONTHS.includes(m[1])) {
    return { param: `${m[1]}.${m[2]}`, monthIdx: MONTHS.indexOf(m[1]), year: parseInt(m[2], 10) }
  }
  // Current month in US Eastern (ForexFactory's reference timezone).
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date())
  const year = parseInt(parts.find((p) => p.type === "year")!.value, 10)
  const monthIdx = parseInt(parts.find((p) => p.type === "month")!.value, 10) - 1
  return { param: `${MONTHS[monthIdx]}.${year}`, monthIdx, year }
}

// Extract the balanced `days: [ ... ]` array literal from the page HTML.
// The wrapper object uses unquoted keys (not valid JSON), but the array
// elements themselves are valid JSON, so we isolate and parse just the array.
function extractDaysArray(html: string): unknown[] | null {
  const key = "window.calendarComponentStates"
  const keyIdx = html.indexOf(key)
  if (keyIdx < 0) return null
  const daysIdx = html.indexOf("days:", keyIdx)
  if (daysIdx < 0) return null
  const start = html.indexOf("[", daysIdx)
  if (start < 0) return null

  let depth = 0
  let inStr = false
  let quote = ""
  let esc = false
  for (let j = start; j < html.length; j++) {
    const c = html[j]
    if (inStr) {
      if (esc) esc = false
      else if (c === "\\") esc = true
      else if (c === quote) inStr = false
      continue
    }
    if (c === '"' || c === "'") {
      inStr = true
      quote = c
      continue
    }
    if (c === "[") depth++
    else if (c === "]") {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, j + 1))
        } catch {
          return null
        }
      }
    }
  }
  return null
}

// en-CA formats as YYYY-MM-DD; anchor the event to ForexFactory's ET calendar day.
function etDateISO(dateline: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateline * 1000))
}

const VALID_IMPACT = new Set(["high", "medium", "low", "holiday"])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { param, monthIdx, year } = resolveMonth(searchParams.get("month"))
  const meta = { month: param, monthLabel: `${MONTH_LABELS[monthIdx]} ${year}`, monthIdx, year }

  try {
    const res = await fetch(`https://www.forexfactory.com/calendar?month=${param}`, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate },
    })
    if (!res.ok) throw new Error(`ForexFactory responded ${res.status}`)

    const html = await res.text()
    const days = extractDaysArray(html)
    if (!days) throw new Error("Could not locate calendar data")

    const events: Array<Record<string, unknown>> = []
    for (const day of days as Array<Record<string, unknown>>) {
      const dayEvents = Array.isArray(day?.events) ? (day.events as Array<Record<string, unknown>>) : []
      for (const e of dayEvents) {
        const impact = String(e.impactName || "").toLowerCase()
        if (!VALID_IMPACT.has(impact)) continue
        events.push({
          id: e.id,
          date: etDateISO(Number(e.dateline)),
          dateline: e.dateline,
          time: e.timeLabel || "",
          currency: e.currency || "",
          impact,
          title: e.name || "",
          actual: e.actual ?? "",
          forecast: e.forecast ?? "",
          previous: e.previous ?? "",
        })
      }
    }

    events.sort((a, b) => Number(a.dateline) - Number(b.dateline))

    return NextResponse.json(
      { source: "forexfactory", ...meta, count: events.length, events },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } },
    )
  } catch (err) {
    return NextResponse.json(
      { source: "error", ...meta, count: 0, events: [], error: (err as Error).message },
      { status: 200 },
    )
  }
}
