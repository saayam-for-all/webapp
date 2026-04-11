const TOKEN_KEY = "idToken";

// Saving token after login
export const setToken = (token) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

// Get token when API calls
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

// Clear token when user logout
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);
