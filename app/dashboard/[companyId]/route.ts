import { headers } from "next/headers"
import { serveTradeSafe } from "@/lib/serve-app"

export const dynamic = "force-dynamic"

// Whop's standard "Dashboard path" (admin/owner view). Set this exact path in
// your Whop app's Hosting settings: /dashboard/[companyId].
export async function GET() {
  return serveTradeSafe(await headers())
}
