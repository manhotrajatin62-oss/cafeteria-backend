import apiClient from "./apiClient";

export const getProducts = () => {
  return apiClient.get("/items");
};

export const addProduct = (data: any) => {
  return apiClient.post("/items", data);
};

export const editProduct = (id: string, data: any) => {
  return apiClient.patch(`/items/${id}`, data);
};

export const deleteProduct = (id: string) => {
  return apiClient.delete(`/items/${id}`);
};