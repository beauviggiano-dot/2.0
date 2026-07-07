import { redirect } from "next/navigation"

// Everything lives behind auth now: send visitors to the gated app entry,
// which will bounce them to /sign-in if they don't have a session.
export default function Page() {
  redirect("/app")
}
