import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

// Serves the TradeSafe HTML shell, but only to a signed-in user. Anyone without
// a session is bounced to the sign-in page.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", await baseUrl()))
  }

  const html = await readFile(join(process.cwd(), "private", "tradesafe.html"), "utf8")
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}

async function baseUrl() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? "https"
  return `${proto}://${host}`
}
