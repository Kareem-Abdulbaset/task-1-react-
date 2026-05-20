import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://testingapi.alrowadit.com";

export const TOKEN_STORAGE_KEY = "token";
export const USER_STORAGE_KEY = "medcases_user";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/api/auth/login/");

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error) {
  if (!error.response) {
    return "Cannot connect to API. Please try again later.";
  }

  const data = error.response.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];

    if (Array.isArray(firstValue)) {
      return firstValue.join(" ");
    }

    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return "Something went wrong. Please try again.";
}

export default apiClient;
