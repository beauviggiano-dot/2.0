import crypto from "node:crypto"

// Signed, tamper-proof session cookie. We store a tiny JSON payload and sign it
// with HMAC-SHA256 using WHOP_SESSION_SECRET so a user can't forge access.
const COOKIE_NAME = "ts_session"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

export type Session = {
  userId: string
  username?: string
  // Whether the user owned the required product at login time.
  access: boolean
  // Unix seconds when this session expires.
  exp: number
}

function secret(): string {
  const s = process.env.WHOP_SESSION_SECRET
  if (!s) throw new Error("WHOP_SESSION_SECRET is not set")
  return s
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url")
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url")
}

// Serialize + sign a session into the cookie string value.
export function encodeSession(session: Session): string {
  const payload = b64url(JSON.stringify(session))
  const sig = sign(payload)
  return `${payload}.${sig}`
}

// Verify + parse a cookie value back into a Session (or null if invalid/expired).
export function decodeSession(value: string | undefined | null): Session | null {
  if (!value) return null
  const [payload, sig] = value.split(".")
  if (!payload || !sig) return null

  // Constant-time signature check.
  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export function newSession(input: Omit<Session, "exp">): Session {
  return { ...input, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS }
}

export const SESSION_COOKIE = COOKIE_NAME
export const SESSION_MAX_AGE = MAX_AGE_SECONDS
