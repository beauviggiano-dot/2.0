type GateScreenProps = {
  variant: "login" | "no_access" | "error"
  username?: string
  checkoutUrl?: string | null
  message?: string
}

// The public shell shown to anyone who is not a verified member. It mirrors the
// TradeSafe dark/gold look so the transition into the app feels seamless.
export function GateScreen({ variant, username, checkoutUrl, message }: GateScreenProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0E1116] px-6 py-16 text-[#E5E9EF]">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-9 w-2.5 rounded-sm bg-[#D4A24C]" aria-hidden="true" />
          <span className="font-sans text-2xl font-bold tracking-wide">TradeSafe</span>
        </div>

        {variant === "login" && (
          <>
            <h1 className="text-balance text-xl font-semibold leading-relaxed">
              Members-only trading workspace
            </h1>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-[#8B93A1]">
              Access is restricted to active members. Sign in with your Whop account to continue.
            </p>
            <a
              href="/api/auth/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#D4A24C] px-5 py-3 font-semibold text-[#14110A] transition hover:brightness-110"
            >
              Log in with Whop
            </a>
          </>
        )}

        {variant === "no_access" && (
          <>
            <h1 className="text-balance text-xl font-semibold leading-relaxed">
              {username ? `Hi ${username}, ` : ""}you don&apos;t have access yet
            </h1>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-[#8B93A1]">
              Your Whop account is signed in, but it doesn&apos;t have an active membership for this
              product. Grab access to unlock the full TradeSafe workspace.
            </p>
            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#D4A24C] px-5 py-3 font-semibold text-[#14110A] transition hover:brightness-110"
              >
                Get access
              </a>
            ) : null}
            <a
              href="/api/auth/logout"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#232A33] px-5 py-3 text-sm text-[#8B93A1] transition hover:border-[#D4A24C]/40 hover:text-[#D4A24C]"
            >
              Sign in with a different account
            </a>
          </>
        )}

        {variant === "error" && (
          <>
            <h1 className="text-balance text-xl font-semibold leading-relaxed">
              Something went wrong
            </h1>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-[#8B93A1]">
              {message || "We couldn't complete sign-in. Please try again."}
            </p>
            <a
              href="/api/auth/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#D4A24C] px-5 py-3 font-semibold text-[#14110A] transition hover:brightness-110"
            >
              Try again
            </a>
          </>
        )}

        <p className="mt-10 text-xs leading-relaxed text-[#5A626E]">
          Powered by Whop &middot; Your session is verified on every visit.
        </p>
      </div>
    </main>
  )
}
