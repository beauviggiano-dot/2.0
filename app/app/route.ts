import { cookies } from "next/headers"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { decodeSession, SESSION_COOKIE } from "@/lib/session"

export const dynamic = "force-dynamic"

// Serves the actual TradeSafe app HTML — but ONLY to a verified, paying member.
// The file lives in /private (outside /public) so it can never be fetched
// directly; the only way to get it is through this authenticated route.
export async function GET() {
  const store = await cookies()
  const session = decodeSession(store.get(SESSION_COOKIE)?.value)

  if (!session || !session.access) {
    return new Response("Unauthorized", { status: 401 })
  }

  const filePath = path.join(process.cwd(), "private", "tradesafe.html")
  const html = await readFile(filePath, "utf8")
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
