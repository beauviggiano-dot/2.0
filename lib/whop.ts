// Thin wrapper around Whop's OAuth 2 + REST API. We deliberately use the raw
// HTTP endpoints (the @whop/api npm package is deprecated) so this keeps working.
//
// Endpoints (verified against api.whop.com):
//   Authorize: https://whop.com/oauth/?client_id=...&redirect_uri=...&response_type=code&scope=...
//   Token:     POST https://api.whop.com/api/v5/oauth/token
//   Me:        GET  https://api.whop.com/api/v5/me
//   Members:   GET  https://api.whop.com/api/v5/me/memberships

const AUTHORIZE_URL = "https://whop.com/oauth"
const TOKEN_URL = "https://api.whop.com/api/v5/oauth/token"
const API_BASE = "https://api.whop.com/api/v5"

export function getConfig() {
  const clientId = process.env.WHOP_CLIENT_ID
  const clientSecret = process.env.WHOP_CLIENT_SECRET
  const appUrl = process.env.WHOP_APP_URL
  // The access pass / product the user must own. Accept either the product id
  // (prod_...) or an access pass id (pass_...).
  const productId = process.env.WHOP_PRODUCT_ID
  const checkoutUrl = process.env.WHOP_CHECKOUT_URL || null

  const missing: string[] = []
  if (!clientId) missing.push("WHOP_CLIENT_ID")
  if (!clientSecret) missing.push("WHOP_CLIENT_SECRET")
  if (!appUrl) missing.push("WHOP_APP_URL")
  if (!productId) missing.push("WHOP_PRODUCT_ID")

  return {
    clientId,
    clientSecret,
    appUrl,
    productId,
    checkoutUrl,
    redirectUri: appUrl ? `${appUrl.replace(/\/$/, "")}/api/auth/callback` : "",
    missing,
  }
}

// Build the URL we send the user to in order to log in with Whop.
export function buildAuthorizeUrl(state: string): string {
  const { clientId, redirectUri } = getConfig()
  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "read_user",
    state,
  })
  return `${AUTHORIZE_URL}?${params.toString()}`
}

type TokenResponse = {
  access_token?: string
  token_type?: string
  error?: string
  error_description?: string
}

// Exchange the authorization code for a user access token.
export async function exchangeCode(code: string): Promise<string | null> {
  const { clientId, clientSecret, redirectUri } = getConfig()
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  })
  const data = (await res.json().catch(() => ({}))) as TokenResponse
  if (!res.ok || !data.access_token) {
    console.log("[v0] Whop token exchange failed:", res.status, data.error, data.error_description)
    return null
  }
  return data.access_token
}

type WhopUser = { id: string; username?: string }

// Fetch the logged-in user's profile using their access token.
export async function getMe(accessToken: string): Promise<WhopUser | null> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    console.log("[v0] Whop /me failed:", res.status)
    return null
  }
  const data = (await res.json().catch(() => ({}))) as WhopUser
  if (!data?.id) return null
  return data
}

type Membership = {
  id: string
  product_id?: string
  access_pass_id?: string
  plan_id?: string
  valid?: boolean
  status?: string
}

type MembershipsResponse = { data?: Membership[] }

// Determine whether the user currently holds a *valid* membership to the
// required product / access pass. This is the core gate.
export async function userHasAccess(accessToken: string): Promise<boolean> {
  const { productId } = getConfig()
  if (!productId) return false

  const res = await fetch(`${API_BASE}/me/memberships?valid=true&per=50`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    console.log("[v0] Whop /me/memberships failed:", res.status)
    return false
  }
  const data = (await res.json().catch(() => ({}))) as MembershipsResponse
  const memberships = data.data || []

  return memberships.some((m) => {
    const matchesProduct = m.product_id === productId || m.access_pass_id === productId
    const isValid = m.valid === true || m.status === "active" || m.status === "completed"
    return matchesProduct && isValid
  })
}
