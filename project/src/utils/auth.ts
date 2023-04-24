const TOKEN_KEY = 'user-token';
const AUTH_USER = 'auth_user';

export const login = (value: string) => {
  if (value.length) return localStorage.setItem(TOKEN_KEY, value);
  return false;
};

export const token = () => localStorage.getItem(TOKEN_KEY) || '';

export const logout = () => {
  localStorage.removeItem(AUTH_USER);
  localStorage.removeItem(TOKEN_KEY);
};

export const rememberMeToken = () => localStorage.getItem('remember_me_token') || '';

export const isUserLoggedIn = () => {
  if (localStorage.getItem(TOKEN_KEY) && localStorage.getItem(AUTH_USER)) {
    return true;
  }

  return false;
};

export const getLoggedInUser = () => {
  if (localStorage.getItem(AUTH_USER)) {
    return JSON.parse(localStorage.getItem(AUTH_USER) || '');
  }

  return false;
};
