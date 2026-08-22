import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export default async function Page() {
  try {
    // Verify the user is coming from Whop
    await whopsdk.verifyUserToken(await headers());

    // User is allowed → send them to the real journal
    redirect("/tradsafe.html");
  } catch (error) {
    // Not coming from Whop
    return (
      <div style={{ padding: "60px", textAlign: "center", fontFamily: "system-ui" }}>
        <h1>Access Denied</h1>
        <p>Please open this tool through your Whop membership.</p>
      </div>
    );
  }
}
