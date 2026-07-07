'use client'

import { createAuthClient } from 'better-auth/react'

// Shared storage key for the session bearer token. The vanilla-JS TradeSafe app
// (private/tradesafe.js) reads this same key to authenticate its /api/sync
// calls, so keep it in sync if you ever rename it.
export const TOKEN_KEY = 'ts_bearer_token'

export const authClient = createAuthClient({
  fetchOptions: {
    // Send the stored token on every request as an Authorization header.
    auth: {
      type: 'Bearer',
      token: () =>
        (typeof window !== 'undefined' && localStorage.getItem(TOKEN_KEY)) || '',
    },
    // Better Auth returns the session token in the `set-auth-token` response
    // header on sign-in/sign-up. Persist it so future requests are authed
    // without relying on cookies (which are blocked in cross-origin iframes).
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get('set-auth-token')
      if (token && typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token)
      }
    },
  },
})

export const { signIn, signUp, signOut, useSession } = authClient
