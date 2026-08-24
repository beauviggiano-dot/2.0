import { gateway, streamText } from "ai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const MAX_MESSAGE = 6000
const MAX_PROFILE = 12000
const MAX_TRADES = 8
const MAX_IMAGE_BYTES = 2_000_000

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const profile = clean(body?.profile, MAX_PROFILE)
    const explanation = clean(body?.explanation, MAX_MESSAGE)
    const trades = Array.isArray(body?.trades) ? body.trades.slice(0, MAX_TRADES) : []
    if (!profile || !explanation) {
      return NextResponse.json({ error: "Add your strategy profile and trade explanation first." }, { status: 400 })
    }

    const tradeContext = trades.map((trade: Record<string, unknown>, index: number) => ({
      trade: index + 1,
      date: clean(trade.date, 40),
      instrument: clean(trade.instrument, 80),
      direction: clean(trade.direction, 40),
      outcome: clean(trade.outcome, 40),
      pnl: typeof trade.pnl === "number" ? trade.pnl : null,
      notes: clean(trade.notes, 2400),
      screenshots: Array.isArray(trade.screenshots)
        ? trade.screenshots.filter((image): image is string => typeof image === "string" && image.startsWith("data:image/") && image.length <= MAX_IMAGE_BYTES).slice(0, 3)
        : [],
    }))

    const prompt = [
      "USER STRATEGY PROFILE:\n" + profile,
      "\nJOURNAL TRADES:\n" + JSON.stringify(tradeContext),
      "\nUSER'S TRADE EXPLANATION:\n" + explanation,
      "\nAnalyze whether the trade followed the user's stated strategy. Reference concrete facts from the journal and screenshots when available. Separate facts, likely interpretations, and open questions. Give practical, non-prescriptive coaching. Do not invent missing chart details, and do not provide financial advice or tell the user what to buy or sell.",
    ].join("\n")

    const result = streamText({
      model: gateway("google/gemini-2.5-flash-lite"),
      system: "You are TradeSafe Trade Analyst, a careful trading-journal coach. The user's own strategy rules are the source of truth. Be specific, balanced, and concise.",
      prompt,
      maxOutputTokens: 1200,
    })

    return result.toTextStreamResponse()
  } catch {
    return NextResponse.json({ error: "Unable to analyze this trade right now." }, { status: 500 })
  }
}
