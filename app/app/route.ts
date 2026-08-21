import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Serves the TradeSafe HTML shell. The workspace is intentionally public and
// local-first; user data remains in browser storage until explicitly exported.
export async function GET() {
  const html = await readFile(join(process.cwd(), "private", "tradesafe.html"), "utf8")
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
