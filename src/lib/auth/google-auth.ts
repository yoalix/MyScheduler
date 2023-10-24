import * as http from "http";
const url = require("url");
import nodeOpen from "open";
const destroyer = require("server-destroy");
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
const fs = require("fs");

import { AddressInfo } from "net";
import { redirect } from "next/navigation";

const path = require("path");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://mail.google.com/",
];
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS_JSON || "", "base64").toString()
);
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3002/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:

"redirect_uris": [
  "http://localhost:3002/oauth2callback"
]
`;
function isAddressInfo(addr: string | AddressInfo | null): addr is AddressInfo {
  return (addr as AddressInfo).port !== undefined;
}
/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
  const keys = credentials;
  const key = keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  fs.writeFileSync(TOKEN_PATH, payload);
  process.env["GOOGLE_OAUTH_REFRESH"] =
    client.credentials.refresh_token || undefined;
}
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = fs.readFileSync(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.log({ err });
    return null;
  }
}

export interface LocalAuthOptions {
  keyfile: { web: any };
  scopes: string[];
}

// Open an http server to accept the oauth callback. In this
// simple example, the only request to our webserver is to
// /oauth2callback?code=<code>
export async function authenticate(
  options: LocalAuthOptions
): Promise<OAuth2Client> {
  if (!options || !options.keyfile || typeof options.keyfile !== "object") {
    throw new Error(
      "keyfilePath must be set to the fully qualified path to a GCP credential keyfile."
    );
  }

  const keyFile = options.keyfile;
  const keys = keyFile.web;
  if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
    throw new Error(invalidRedirectUri);
  }
  const redirectUri = new URL(keys.redirect_uris[0] ?? "http://localhost");
  if (redirectUri.hostname !== "localhost") {
    throw new Error(invalidRedirectUri);
  }

  // create an oAuth client to authorize the API call
  const client = new OAuth2Client({
    clientId: keys.client_id,
    clientSecret: keys.client_secret,
  });

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url!, "http://localhost:3002");
        if (url.pathname !== redirectUri.pathname) {
          res.end("Invalid callback URL");
          return;
        }
        const searchParams = url.searchParams;
        if (searchParams.has("error")) {
          res.end("Authorization rejected.");
          reject(new Error(searchParams.get("error")!));
          return;
        }
        if (!searchParams.has("code")) {
          res.end("No authentication code provided.");
          reject(new Error("Cannot read authentication code."));
          return;
        }

        const code = searchParams.get("code");
        const { tokens } = await client.getToken({
          code: code!,
          redirect_uri: redirectUri.toString(),
        });
        client.credentials = tokens;
        resolve(client);
        res.end("Authentication successful! Please return to the console.");
      } catch (e) {
        reject(e);
      } finally {
        // eslint-disable-next-line
        (server as any).destroy();
      }
    });

    let listenPort = 3002;
    if (redirectUri.port !== "") {
      listenPort = Number(redirectUri.port);
    }

    server.listen(listenPort, () => {
      const address = server.address();
      if (isAddressInfo(address)) {
        redirectUri.port = String(address.port);
      }
      const scopes = options.scopes || [];
      // open the browser to the authorize url to start the workflow
      const authorizeUrl = client.generateAuthUrl({
        redirect_uri: redirectUri.toString(),
        access_type: "offline",
        scope: scopes,
      });
      nodeOpen(authorizeUrl, { wait: false }).then((cp) => cp.unref());
    });
    destroyer(server);
  });
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  let jsonclient = await loadSavedCredentialsIfExist();
  if (jsonclient) {
    return jsonclient;
  }
  let client = await authenticate({
    scopes: SCOPES,
    keyfile: credentials,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
