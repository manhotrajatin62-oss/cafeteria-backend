import apiClient from "./apiClient";

export const requestOtp = (email: string) => {
  return apiClient.post("/auth/request-otp", { email });
};

export const loginWithOtp = (email: string, otp: string | number) => {
  return apiClient.post("/auth/login", { email, otp });
};

export const registerUser = (name: string, email: string) => {
  return apiClient.post("/auth/register", { name, email });
};

export const fetchUserInfo = () => {
  return apiClient.get("/auth/me");
};