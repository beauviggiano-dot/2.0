import { headers } from "next/headers";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
});

export default async function Page() {
  try {
    // Just verify the user is coming from Whop
    await whopsdk.verifyUserToken(await headers());

    // User is allowed → show your real journal
    return (
      <div>
        <h1>TradeSafe Journal</h1>
        {/* Put the rest of your journal UI here later */}
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontFamily: "system-ui" }}>
        <h1>Access Denied</h1>
        <p>Please open this tool through your Whop membership.</p>
      </div>
    );
  }
}
