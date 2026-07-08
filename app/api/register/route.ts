import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Server-side gated registration. New accounts can only be created with the
// correct SIGNUP_CODE, which the Whop owner shares only with paying members.
// Enforcing this on the server (not the client) means it can't be bypassed by
// calling Better Auth's sign-up endpoint directly.
export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string; code?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { name, email, password, code } = body

  const expected = process.env.SIGNUP_CODE
  if (!expected) {
    return NextResponse.json(
      { error: 'Registration is not configured. Contact the app owner.' },
      { status: 500 },
    )
  }

  if (!code || code.trim() !== expected) {
    return NextResponse.json(
      { error: 'Invalid access code. Check the code from your membership.' },
      { status: 403 },
    )
  }

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Name, email, and password are required.' },
      { status: 400 },
    )
  }

  try {
    // returnHeaders exposes the bearer plugin's set-auth-token header so the
    // client can store the session token (same flow as a normal sign-up).
    const { headers } = await auth.api.signUpEmail({
      body: { name, email, password },
      returnHeaders: true,
    })

    const token = headers.get('set-auth-token')
    return NextResponse.json({ token: token ?? null })
  } catch (err) {
    const message =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Could not create account.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
