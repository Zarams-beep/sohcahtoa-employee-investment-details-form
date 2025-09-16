import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import readline from "readline";

async function main() {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = "http://localhost";

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env");
  }

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("\n👉 Authorize this app by visiting this URL:\n", url, "\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Paste the code from the browser here: ", async (code) => {
    try {
      const { tokens } = await oAuth2Client.getToken(code.trim());
      console.log("\n✅ Success! Here are your tokens:\n", tokens);

      // Save tokens somewhere safe
      oAuth2Client.setCredentials(tokens);
    } catch (err) {
      console.error("❌ Error retrieving tokens:", err);
    } finally {
      rl.close();
    }
  });
}

main().catch((err) => console.error("Unhandled Error:", err));
