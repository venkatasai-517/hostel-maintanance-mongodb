const TOKEN_KEY = "userToken";
export const login = () => {
  localStorage.setItem(TOKEN_KEY, "s-usc1a-nss-2020.firebaseio.com");
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
export const isLogin = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return true;
  }
  return false;
};
