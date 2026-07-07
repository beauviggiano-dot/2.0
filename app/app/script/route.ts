import { cookies } from "next/headers"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { decodeSession, SESSION_COOKIE } from "@/lib/session"

export const dynamic = "force-dynamic"

// Serves the app's JavaScript bundle, gated the same way as the HTML so the
// software itself can't be lifted by anyone without an active membership.
export async function GET() {
  const store = await cookies()
  const session = decodeSession(store.get(SESSION_COOKIE)?.value)

  if (!session || !session.access) {
    return new Response("// Unauthorized", { status: 401 })
  }

  const filePath = path.join(process.cwd(), "private", "tradesafe.js")
  const js = await readFile(filePath, "utf8")
  return new Response(js, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
