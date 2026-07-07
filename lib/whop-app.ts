// Embedded-app authentication for Whop.
//
// When TradeSafe runs *inside* Whop (an "embedded app" in an iframe), Whop's
// reverse proxy injects a signed `x-whop-user-token` header on EVERY request.
// We verify that token (its signature is checked against Whop's public JWKS)
// to identify the visitor, then confirm they own the required product/access
// pass. There is no login button, redirect, or OAuth consent screen — the whole
// point of an embedded app is that Whop has already authenticated the user.
import { WhopServerSdk, verifyUserToken } from "@whop/api"

export function getWhopConfig() {
  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID
  const appApiKey = process.env.WHOP_API_KEY
  // The product / access pass the visitor must own (prod_... or pass_...).
  const productId = process.env.WHOP_PRODUCT_ID
  const checkoutUrl = process.env.WHOP_CHECKOUT_URL || null

  const missing: string[] = []
  if (!appId) missing.push("NEXT_PUBLIC_WHOP_APP_ID")
  if (!appApiKey) missing.push("WHOP_API_KEY")
  if (!productId) missing.push("WHOP_PRODUCT_ID")

  return { appId, appApiKey, productId, checkoutUrl, missing }
}

export type AccessResult =
  | { state: "ok"; userId: string }
  | { state: "no_token"; detail: string }
  | { state: "no_access"; userId: string; detail: string }
  | { state: "error"; detail: string }

// The single source of truth for "is this visitor allowed to use the app?".
export async function resolveAccess(headerList: Headers): Promise<AccessResult> {
  const { appId, appApiKey, productId, missing } = getWhopConfig()
  if (missing.length) {
    return { state: "error", detail: `Whop is not configured. Missing: ${missing.join(", ")}.` }
  }

  // Diagnostic: list any Whop-injected headers so we can tell whether Whop's
  // proxy is actually forwarding the auth token to this app.
  const whopHeaders = [...headerList.keys()].filter((k) => k.startsWith("x-whop"))
  const headerSummary = whopHeaders.length ? whopHeaders.join(", ") : "none"
  const appIdHint = appId ? `${appId.slice(0, 10)}…` : "unset"

  // 1. Verify the Whop-injected user token. `dontThrow` makes it return null
  //    (instead of throwing) when the header is absent or the token is invalid,
  //    which is exactly what happens if someone opens the app outside Whop.
  const token = headerList.get("x-whop-user-token")
  if (!token) {
    return {
      state: "no_token",
      detail: `No x-whop-user-token header. Whop headers seen: ${headerSummary}. App: ${appIdHint}`,
    }
  }
  let userId: string | null = null
  try {
    const payload = await verifyUserToken(token, { appId: appId!, dontThrow: true })
    userId = payload?.userId ?? null
  } catch (err) {
    console.log("[v0] verifyUserToken failed:", err instanceof Error ? err.message : err)
    userId = null
  }
  if (!userId) {
    return {
      state: "no_token",
      detail: `Token present but failed verification (app ${appIdHint}). Check NEXT_PUBLIC_WHOP_APP_ID matches the installed app.`,
    }
  }

  // 2. Check the user owns the required product using the app's API key.
  try {
    const whop = WhopServerSdk({ appId: appId!, appApiKey: appApiKey! })
    const result = await whop.access.checkIfUserHasAccessToAccessPass({
      accessPassId: productId!,
      userId,
    })
    if (result?.hasAccess) return { state: "ok", userId }
    return { state: "no_access", userId, detail: `User ${userId} lacks access to ${productId}.` }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    console.log("[v0] access check failed:", detail)
    return { state: "error", detail }
  }
}
