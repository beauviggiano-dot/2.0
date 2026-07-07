import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Serves the TradeSafe HTML shell. Auth is enforced client-side via a bearer
// token (see the bootstrap in tradesafe.html): a full-page navigation can't
// carry an Authorization header, so the shell loads for everyone but the app
// immediately redirects to /sign-in if no token is present, and the actual
// user data is protected by the token on /api/sync.
export async function GET() {
  const html = await readFile(join(process.cwd(), "private", "tradesafe.html"), "utf8")
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
