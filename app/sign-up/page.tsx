import { AuthForm } from "@/components/auth-form"

// Auth state lives in a client-side bearer token (not a cookie), so the server
// can't tell if the user is already signed in. The form redirects to /app on
// mount if a token is already present.
export default function SignUpPage() {
  return <AuthForm mode="sign-up" />
}
