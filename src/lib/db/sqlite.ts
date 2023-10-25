export const getTokens = () => {
  return {
    acessToken: process.env.GOOGLE_OAUTH_ACCESS,
    refreshToken: process.env.GOOGLE_OAUTH_REFRESH,
  };
};

export const createOrUpdateRefreshToken = (
  accessToken?: string | null,
  refreshToken?: string | null
) => {
  if (refreshToken) {
    process.env["GOOGLE_OAUTH_REFRESH"] = refreshToken;
  }
  if (accessToken) {
    process.env["GOOGLE_OAUTH_ACCESS"] = accessToken;
  }
  return getTokens();
};
