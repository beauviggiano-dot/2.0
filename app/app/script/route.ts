import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Serves the TradeSafe application JavaScript. The app code itself isn't
// sensitive — user data is protected by the bearer token on /api/sync — and
// the client bootstrap redirects unauthenticated visitors to /sign-in before
// this ever renders anything meaningful.
export async function GET() {
  const js = await readFile(join(process.cwd(), "private", "tradesafe.js"), "utf8")
  return new NextResponse(js, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
