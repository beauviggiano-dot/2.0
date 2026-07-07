import { redirect } from "next/navigation"

// The TradeSafe app is served as a static file. Sending visitors straight to it
// keeps the app fully public with no login or gating.
export default function Page() {
  redirect("/tradesafe.html")
}
