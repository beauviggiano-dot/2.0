import { cookies } from "next/headers"
import { decodeSession, SESSION_COOKIE } from "@/lib/session"
import { getConfig } from "@/lib/whop"
import { GateScreen } from "@/components/gate-screen"
import { AppFrame } from "@/components/app-frame"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ error?: string; detail?: string }>
}

// Server component gate. Reads the signed session cookie and decides what the
// visitor sees: the real app, a "members only" screen, or the login screen.
export default async function Page({ searchParams }: PageProps) {
  const { error, detail } = await searchParams
  const { checkoutUrl, missing } = getConfig()
  const store = await cookies()
  const session = decodeSession(store.get(SESSION_COOKIE)?.value)

  // Verified, paying member -> serve the app.
  if (session?.access) {
    return <AppFrame />
  }

  // App isn't configured yet (missing Whop env vars).
  if (missing.length) {
    return (
      <GateScreen
        variant="error"
        message={`Whop is not fully configured. Missing: ${missing.join(", ")}.`}
      />
    )
  }

  // Signed in but no active membership.
  if (session && !session.access) {
    return (
      <GateScreen variant="no_access" username={session.username} checkoutUrl={checkoutUrl} />
    )
  }

  // Came back from Whop with a specific error.
  if (error === "no_access") {
    return <GateScreen variant="no_access" checkoutUrl={checkoutUrl} detail={detail} />
  }
  if (error && error !== "no_access") {
    const messages: Record<string, string> = {
      config: "The app is missing its Whop configuration.",
      state: "Your login session expired. Please try again.",
      token: "We couldn't verify your Whop login. Please try again.",
      user: "We couldn't load your Whop profile. Please try again.",
    }
    return <GateScreen variant="error" message={messages[error]} detail={detail} />
  }

  // Default: not logged in.
  return <GateScreen variant="login" />
}
