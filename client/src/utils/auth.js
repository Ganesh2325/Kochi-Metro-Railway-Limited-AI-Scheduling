// client/src/utils/auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('kmrl_token');
  return !!token;
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('kmrl_user')) || null;
  } catch (e) {
    return null;
  }
};

export const setUserAndToken = ({ token, name, email }) => {
  if (token) localStorage.setItem('kmrl_token', token);
  if (name && email) localStorage.setItem('kmrl_user', JSON.stringify({ name, email }));
};

export const clearAuth = () => {
  localStorage.removeItem('kmrl_token');
  localStorage.removeItem('kmrl_user');
};
