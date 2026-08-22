import { headers } from "next/headers";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID!,   // ← this line was missing
});

export default async function Page() {
  try {
    const headersList = await headers();
    const { userId } = await whopsdk.verifyUserToken(headersList);

    return (
      <div style={{ padding: "40px", fontFamily: "system-ui" }}>
        <h1>Success!</h1>
        <p>User ID: {userId}</p>
        <p>You are correctly authenticated through Whop.</p>
      </div>
    );
  } catch (error: any) {
    return (
      <div style={{ padding: "40px", fontFamily: "system-ui" }}>
        <h1>Access Denied</h1>
        <p><strong>Error message:</strong></p>
        <pre style={{ background: "#f5f5f5", padding: "15px", overflow: "auto" }}>
          {error?.message || String(error)}
        </pre>
      </div>
    );
  }
}
