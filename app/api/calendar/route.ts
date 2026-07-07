import { NextResponse } from "next/server"

// ForexFactory's official weekly economic calendar feed (via faireconomy.media).
const FEED_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"

type FeedEvent = {
  title: string
  country: string
  date: string
  impact: string
  forecast: string
  previous: string
}

function mapImpact(raw: string): "high" | "medium" | "low" {
  const t = (raw || "").toLowerCase()
  if (t.includes("high")) return "high"
  if (t.includes("medium") || t.includes("moderate")) return "medium"
  return "low"
}

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (TradeSafe Economic Calendar)" },
      // Cache for 15 minutes, serve stale while revalidating.
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Feed responded ${res.status}` }, { status: 502 })
    }

    const raw = (await res.json()) as FeedEvent[]

    const events = raw
      .map((e) => {
        // The feed timestamp is in US Eastern time (ForexFactory default), e.g.
        // "2026-07-06T02:00:00-04:00". Preserve that wall-clock time directly.
        const date = e.date.slice(0, 10)
        const time = e.date.slice(11, 16)
        const weekday = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
        return {
          date,
          time,
          weekday,
          currency: e.country,
          impact: mapImpact(e.impact),
          title: e.title,
          forecast: e.forecast?.trim() || "—",
          previous: e.previous?.trim() || "—",
        }
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

    return NextResponse.json({ events })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }
}
