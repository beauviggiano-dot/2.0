import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/session"
import { getConfig } from "@/lib/whop"

export const dynamic = "force-dynamic"

// Clear the session cookie and return to the landing/login screen.
export async function GET(request: Request) {
  const { appUrl } = getConfig()
  const base = appUrl || new URL(request.url).origin
  const res = NextResponse.redirect(new URL("/", base))
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
