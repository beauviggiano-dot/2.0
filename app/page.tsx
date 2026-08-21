import { redirect } from "next/navigation"

// TradeSafe is a local-first app: send visitors directly to the workspace.
// Data stays in the browser unless the user explicitly exports a backup file.
export default function Page() {
  redirect("/app")
}
