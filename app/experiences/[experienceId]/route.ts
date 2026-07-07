import { headers } from "next/headers"
import { serveTradeSafe } from "@/lib/serve-app"

export const dynamic = "force-dynamic"

// Whop's standard embedded "App path". Set this exact path in your Whop app's
// Hosting settings: /experiences/[experienceId]. Whop loads this inside its
// iframe through its proxy, which injects the x-whop-user-token header.
export async function GET() {
  return serveTradeSafe(await headers())
}
