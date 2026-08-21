import { headers } from "next/headers";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
});

export default async function Page() {
  try {
    // Verify the request is coming from Whop
    const { userId } = await whopsdk.verifyUserToken(await headers());

    // Check if the user has access to your product
    // You can leave "prod_xxxxxxxx" for now, or replace it with your real Product ID later
    const access = await whopsdk.users.checkAccess("prod_xxxxxxxx", {
      id: userId,
    });

    if (!access.has_access) {
      return (
        <div style={{ padding: "60px", textAlign: "center", fontFamily: "system-ui" }}>
          <h1>Access Denied</h1>
          <p>Please open this tool through your Whop membership.</p>
        </div>
      );
    }

    // User is allowed → show your real trading journal
    return (
      <div>
        {/* Put your normal journal UI here */}
        <h1>TradeSafe Journal</h1>
        {/* ... the rest of your existing journal code ... */}
      </div>
    );
  } catch (error) {
    // No valid Whop token
    return (
      <div style={{ padding: "60px", textAlign: "center", fontFamily: "system-ui" }}>
        <h1>Access Denied</h1>
        <p>Please open this tool through your Whop membership.</p>
      </div>
    );
  }
}
