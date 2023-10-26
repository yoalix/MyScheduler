import { OAuth2Client } from "google-auth-library";
import { createOrUpdateRefreshToken } from "../redis/kv";

const path = require("path");
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://mail.google.com/",
];

const REDIRECT_URI = process.env.ORIGIN + "/api/oauth2callback";
// create an oAuth client to authorize the API call
export const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_SECRET,
  redirectUri: REDIRECT_URI,
});

export async function getAndStoreTokens(code: string) {
  const { tokens } = await oauth2Client.getToken({
    code: code,
  });
  if (tokens.refresh_token || tokens.access_token) {
    createOrUpdateRefreshToken(
      tokens.access_token,
      tokens.refresh_token,
      tokens.expiry_date
    );
  }
  return tokens;
}

export async function createAuthLink() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  });
  return authUrl;
}
