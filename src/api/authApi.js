import apiClient from "./apiClient.js";

export async function loginRequest(credentials) {
  const response = await apiClient.post("/api/auth/login/", credentials);
  return response.data;
}

export async function getCurrentUserRequest() {
  const response = await apiClient.get("/api/auth/me/");
  return response.data;
}
