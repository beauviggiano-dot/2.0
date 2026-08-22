import { headers } from "next/headers";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export default async function Page() {
  try {
    await whopsdk.verifyUserToken(await headers());

    return (
      <div style={{ padding: "40px", fontFamily: "system-ui" }}>
        <h1>Authentication works!</h1>
        <p>We will now load your real journal.</p>
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
