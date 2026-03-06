import apiClient from "./apiClient";

export const getProducts = () => {
  return apiClient.get("/items");
};

export const addProduct = (data:any) => {
  return apiClient.post("/items", data)
}