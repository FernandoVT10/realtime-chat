const TOKEN_KEY = "token";

const getAuthToken = (): string | null => {
  return window.localStorage.getItem(TOKEN_KEY);
};

export default getAuthToken;
