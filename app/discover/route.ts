import { getWhopConfig } from "@/lib/whop-app"

export const dynamic = "force-dynamic"

// Whop's standard "Discover path" — a public marketing page shown to people
// browsing before they buy. No auth gate here. Set this exact path in your
// Whop app's Hosting settings: /discover.
export async function GET() {
  const { checkoutUrl } = getWhopConfig()
  const cta = checkoutUrl
    ? `<a class="btn" href="${escapeHtml(checkoutUrl)}" target="_top">Get access</a>`
    : ""

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TradeSafe — Members-only trading workspace</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0E1116; color: #E5E9EF; padding: 24px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  .card { width: 100%; max-width: 460px; text-align: center; }
  .brand { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
  .bar { height: 36px; width: 10px; border-radius: 3px; background: #D4A24C; }
  .brand-name { font-size: 24px; font-weight: 700; letter-spacing: 0.02em; }
  h1 { font-size: 22px; font-weight: 600; line-height: 1.5; margin: 0 0 12px; }
  p { font-size: 15px; line-height: 1.6; color: #8B93A1; margin: 0 auto; max-width: 40ch; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; width: 100%;
    margin-top: 28px; padding: 13px 20px; border-radius: 10px; background: #D4A24C;
    color: #14110A; font-weight: 600; text-decoration: none; transition: filter .15s ease;
  }
  .btn:hover { filter: brightness(1.08); }
  .footer { margin-top: 40px; font-size: 12px; color: #5A626E; }
</style>
</head>
<body>
  <main class="card">
    <div class="brand"><span class="bar" aria-hidden="true"></span><span class="brand-name">TradeSafe</span></div>
    <h1>A members-only day trading workspace</h1>
    <p>Discipline tools, risk guardrails, and a focused trading dashboard — available to active TradeSafe members inside Whop.</p>
    ${cta}
    <p class="footer">Powered by Whop</p>
  </main>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
