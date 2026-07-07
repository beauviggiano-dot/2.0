import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { buildAuthorizeUrl, getConfig } from "@/lib/whop"

export const dynamic = "force-dynamic"

// Kick off the OAuth flow: generate a CSRF state, stash it in a short-lived
// cookie, then bounce the user to Whop's login/consent screen.
export async function GET() {
  const { missing } = getConfig()
  if (missing.length) {
    return NextResponse.redirect(
      new URL("/?error=config", process.env.WHOP_APP_URL || "http://localhost:3000"),
    )
  }

  const state = crypto.randomBytes(16).toString("hex")
  const res = NextResponse.redirect(buildAuthorizeUrl(state))
  res.cookies.set("ts_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes to complete login
  })
  return res
}
