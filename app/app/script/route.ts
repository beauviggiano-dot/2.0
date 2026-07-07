import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

// Serves the TradeSafe application JavaScript, gated behind a valid session so
// the app code isn't publicly downloadable.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new NextResponse("// unauthorized", {
      status: 401,
      headers: { "content-type": "application/javascript; charset=utf-8" },
    })
  }

  const js = await readFile(join(process.cwd(), "private", "tradesafe.js"), "utf8")
  return new NextResponse(js, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
