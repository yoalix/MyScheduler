import { kv } from "@vercel/kv";

export const getTokens = async () => {
  let accessToken = (await kv.get<string>("accessToken")) || "";
  let refreshToken = (await kv.get<string>("refreshToken")) || "";
  return {
    accessToken,
    refreshToken,
  };
};

export const createOrUpdateRefreshToken = async (
  accessToken?: string | null,
  refreshToken?: string | null
) => {
  if (accessToken) {
    await kv.set("accessToken", accessToken);
  }
  if (refreshToken) {
    await kv.set("refreshToken", refreshToken);
  }
  return getTokens();
};
