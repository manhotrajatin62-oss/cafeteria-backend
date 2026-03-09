import apiClient from "./apiClient";

export const getCategories = () => {
  return apiClient.get("/category");
};

export const createCategory = (data: any) => {
  return apiClient.post("/category", data);
};

export const addItemToCategory = (categoryId: string, itemId: string) => {
  return apiClient.post("/category/add-item", {
    categoryId,
    itemId,
  });
};

export const deleteItemFromCategory = (data: {
  categoryId: string;
  itemId: string | number;
}) => {
  return apiClient.delete("/category/delete-item", { data });
};

export const deleteCategory = (data: { categoryId: string }) => {
  return apiClient.delete("/category/delete", { data });
};