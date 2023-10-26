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
  refreshToken?: string | null,
  expire?: number | null
) => {
  let options;
  if (expire) {
    options = { pxat: expire };
  }
  if (accessToken) {
    await kv.set("accessToken", accessToken, options);
  }
  if (refreshToken) {
    await kv.set("refreshToken", refreshToken);
  }
  return getTokens();
};

export const setAccessToken = async (
  accessToken: string,
  expire: number
): Promise<string> => {
  await kv.set("accessToken", accessToken, { ex: expire });
  return accessToken;
};
