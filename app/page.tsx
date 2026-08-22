import { headers } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import Whop from "@whop/sdk";

const whopsdk = new Whop({
  apiKey: process.env.WHOP_API_KEY!,
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
});

export default async function Page() {
  try {
    // 1. Verify the user is coming from Whop
    await whopsdk.verifyUserToken(await headers());

    // 2. Read your real journal HTML file
    const htmlPath = path.join(process.cwd(), "public", "tradsafe.html");
    const html = await readFile(htmlPath, "utf-8");

    // 3. Return the real journal
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ width: "100%", height: "100vh" }}
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
