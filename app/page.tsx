import { headers } from "next/headers";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export default async function Page() {
  try {
    // 1. Verify the user is coming from Whop
    await whopsdk.verifyUserToken(await headers());

    // 2. Load the real journal from the private folder
    const html = await readFile(
      join(process.cwd(), "private", "tradesafe.html"),
      "utf8"
    );

    // 3. Return the journal
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}
      />
    );
  } catch (error) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          fontFamily: "system-ui",
        }}
      >
        <h1>Access Denied</h1>
        <p>Please open this tool through your Whop membership.</p>
      </div>
    );
  }
}
