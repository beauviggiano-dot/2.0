import { headers } from "next/headers";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export default async function Page() {
  try {
    // Verify the user is coming from Whop
    await whopsdk.verifyUserToken(await headers());

    // Show the real journal inside an iframe
    return (
      <iframe
        src="/tradsafe.html"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
        }}
        title="TradeSafe Journal"
      />
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
