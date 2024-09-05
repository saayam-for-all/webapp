import axios from "axios";

// centralizing the configuration and reusing the instance across the application

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // You can add token or other custom headers here if needed
    // const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors, e.g., token expiration or network issues
    if (error.response.status === 401) {
      // Redirect to login page or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;
