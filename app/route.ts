import { headers } from "next/headers"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { resolveAccess, getWhopConfig, type AccessResult } from "@/lib/whop-app"

export const dynamic = "force-dynamic"

// Entry point for the embedded Whop app. Whop loads this route inside its
// iframe with the `x-whop-user-token` header set. Verified, paying members get
// the real TradeSafe app; everyone else gets a members-only screen. The app's
// HTML + JS are read from /private (outside /public) so the software can never
// be fetched directly by an unauthenticated visitor.
export async function GET() {
  const result = await resolveAccess(await headers())

  if (result.state === "ok") {
    const html = await buildAppHtml()
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    })
  }

  return new Response(gateHtml(result), {
    status: result.state === "error" ? 500 : 403,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  })
}

// Read the private app files and inline the JS bundle into the HTML so the
// whole app is delivered in one authenticated response (no separate, ungated
// script request).
async function buildAppHtml(): Promise<string> {
  const dir = path.join(process.cwd(), "private")
  const [html, js] = await Promise.all([
    readFile(path.join(dir, "tradesafe.html"), "utf8"),
    readFile(path.join(dir, "tradesafe.js"), "utf8"),
  ])
  const safeJs = js.replace(/<\/script>/gi, "<\\/script>")
  return html.replace(
    /<script src="\/app\/script[^"]*"><\/script>/,
    `<script>\n${safeJs}\n</script>`,
  )
}

// A small, self-contained members-only / error page in the TradeSafe look.
function gateHtml(result: Exclude<AccessResult, { state: "ok" }>): string {
  const { checkoutUrl } = getWhopConfig()

  let heading = "Members only"
  let body = "Access to TradeSafe is restricted to active members."
  let cta = ""

  if (result.state === "no_token") {
    heading = "Open TradeSafe inside Whop"
    body =
      "This app runs inside your Whop. Open it from your Whop dashboard or product page to get instant access — there is no separate login."
  } else if (result.state === "no_access") {
    heading = "You don't have access yet"
    body =
      "You're signed in to Whop, but your account doesn't have an active TradeSafe membership. Grab access to unlock the full workspace."
    if (checkoutUrl) {
      cta = `<a class="btn" href="${escapeHtml(checkoutUrl)}" target="_top">Get access</a>`
    }
  } else if (result.state === "error") {
    heading = "Something went wrong"
    body = "We couldn't verify your access. Please refresh, or contact support if this continues."
  }

  const detailText = "detail" in result ? result.detail : ""
  const detail = detailText ? `<p class="detail">${escapeHtml(detailText)}</p>` : ""

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TradeSafe</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0E1116; color: #E5E9EF; padding: 24px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  .card { width: 100%; max-width: 420px; text-align: center; }
  .brand { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
  .bar { height: 36px; width: 10px; border-radius: 3px; background: #D4A24C; }
  .brand-name { font-size: 24px; font-weight: 700; letter-spacing: 0.02em; }
  h1 { font-size: 20px; font-weight: 600; line-height: 1.5; margin: 0 0 12px; }
  p { font-size: 14px; line-height: 1.6; color: #8B93A1; margin: 0 auto; max-width: 34ch; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; width: 100%;
    margin-top: 28px; padding: 13px 20px; border-radius: 10px; background: #D4A24C;
    color: #14110A; font-weight: 600; text-decoration: none; transition: filter .15s ease;
  }
  .btn:hover { filter: brightness(1.08); }
  .detail {
    margin-top: 22px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px; color: #7B93A1; background: #131820; border: 1px solid #232A33;
    border-radius: 8px; padding: 10px 12px; word-break: break-word; max-width: none;
  }
  .footer { margin-top: 40px; font-size: 12px; color: #5A626E; }
</style>
</head>
<body>
  <main class="card">
    <div class="brand"><span class="bar" aria-hidden="true"></span><span class="brand-name">TradeSafe</span></div>
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(body)}</p>
    ${cta}
    ${detail}
    <p class="footer">Powered by Whop</p>
  </main>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
