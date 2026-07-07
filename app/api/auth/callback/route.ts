import { NextResponse } from "next/server"
import { exchangeCode, getMe, userHasAccess, getConfig } from "@/lib/whop"
import { encodeSession, newSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session"

export const dynamic = "force-dynamic"

// Whop redirects back here with ?code=...&state=.... We verify state, exchange
// the code for a user token, confirm the user owns the product, then set our
// signed session cookie and send them into the app.
export async function GET(request: Request) {
  const { appUrl } = getConfig()
  const base = appUrl || new URL(request.url).origin
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  const cookieState = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("ts_oauth_state="))
    ?.split("=")[1]

  // CSRF protection: the state we sent must match the one Whop echoed back.
  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(new URL("/?error=state", base))
  }

  const withDetail = (path: string, detail?: string) => {
    const url = new URL(path, base)
    if (detail) url.searchParams.set("detail", detail)
    return url
  }

  const { token: accessToken, detail: tokenDetail } = await exchangeCode(code)
  if (!accessToken) {
    return NextResponse.redirect(withDetail("/?error=token", tokenDetail))
  }

  const { user, detail: userDetail } = await getMe(accessToken)
  if (!user) {
    return NextResponse.redirect(withDetail("/?error=user", userDetail))
  }

  const { access, detail: accessDetail } = await userHasAccess(accessToken)

  // Build our own signed session. If they don't have access we still record who
  // they are so the "members only" screen can offer a tailored purchase link.
  const session = newSession({ userId: user.id, username: user.username, access })
  const res = NextResponse.redirect(
    access ? new URL("/", base) : withDetail("/?error=no_access", accessDetail),
  )
  res.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
  // Clear the one-time state cookie.
  res.cookies.set("ts_oauth_state", "", { path: "/", maxAge: 0 })
  return res
}
