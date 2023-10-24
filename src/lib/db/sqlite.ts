export const getRefreshToken = () => {
  return process.env.GOOGLE_OAUTH_REFRESH;
};

export const createOrUpdateRefreshToken = (token: string) => {
  process.env["GOOGLE_OAUTH_REFRESH"] = token;
  return getRefreshToken();
};
