import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_DIR = path.resolve(__dirname, "../..");

const CREDENTIALS_PATH = path.join(
  BACKEND_DIR,
  "credentials.json"
);

const TOKEN_PATH = path.join(
  BACKEND_DIR,
  "token.json"
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events"
];

async function main() {
  const credentialsFile = await fs.readFile(
    CREDENTIALS_PATH,
    "utf8"
  );

  const credentials = JSON.parse(credentialsFile);

  const config =
    credentials.installed ||
    credentials.web;

  if (!config) {
    throw new Error(
      "Invalid Google OAuth credentials.json"
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    config.redirect_uris?.[0]
  );

  const authorizationUrl =
    oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent"
    });

  console.log("\nOpen this URL in your browser:\n");
  console.log(authorizationUrl);
  console.log("\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(
    "Paste the authorization code here: ",
    async (code) => {
      rl.close();

      try {
        const { tokens } =
          await oauth2Client.getToken(code);

        await fs.writeFile(
          TOKEN_PATH,
          JSON.stringify(tokens, null, 2)
        );

        console.log(
          "\nGoogle authorization successful!"
        );

        console.log(
          `Token saved to: ${TOKEN_PATH}`
        );
      } catch (error) {
        console.error(
          "\nGoogle authorization failed:"
        );

        console.error(
          error.response?.data || error.message
        );

        process.exit(1);
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});