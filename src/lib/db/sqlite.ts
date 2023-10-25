function resetTokens() {
  process.env["GOOGLE_OAUTH_ACCESS"] = "";
  process.env["GOOGLE_OAUTH_REFRESH"] = "";
}

export const getTokens = () => {
  return {
    accessToken: process.env.GOOGLE_OAUTH_ACCESS,
    refreshToken: process.env.GOOGLE_OAUTH_REFRESH,
  };
};

export const createOrUpdateRefreshToken = (
  accessToken?: string | null,
  refreshToken?: string | null
) => {
  if (accessToken) {
    process.env.GOOGLE_OAUTH_ACCESS = accessToken;
  }
  if (refreshToken) {
    process.env.GOOGLE_OAUTH_REFRESH = refreshToken;
  }
  console.log("tokens set");
  console.log(process.env);
  return getTokens();
};

resetTokens();
