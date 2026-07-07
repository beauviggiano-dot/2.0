import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userData } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

// GET /api/sync -> returns this user's saved data document ({} if none yet).
export async function GET() {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await db
    .select()
    .from(userData)
    .where(eq(userData.userId, userId))
    .limit(1)

  const row = rows[0]
  return NextResponse.json(
    { data: row?.data ?? {}, updatedAt: row?.updatedAt ?? null },
    { headers: { "cache-control": "no-store" } },
  )
}

// PUT /api/sync -> upserts this user's data document.
export async function PUT(request: Request) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const data =
    body && typeof body === "object" && "data" in body
      ? (body as { data: unknown }).data
      : body

  if (data === null || typeof data !== "object") {
    return NextResponse.json({ error: "Expected an object payload" }, { status: 400 })
  }

  const now = new Date()
  await db
    .insert(userData)
    .values({ userId, data: data as Record<string, unknown>, updatedAt: now })
    .onConflictDoUpdate({
      target: userData.userId,
      set: { data: data as Record<string, unknown>, updatedAt: now },
    })

  return NextResponse.json({ ok: true, updatedAt: now }, { headers: { "cache-control": "no-store" } })
}
