import axios from "axios";
import { getAuth } from "../utils/auth";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const data = getAuth();

  if (data?.token) {
    config.headers.Authorization = `Bearer ${data.token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("user");
      globalThis.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default apiClient;
