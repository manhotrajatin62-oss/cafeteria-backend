import apiClient from "./apiClient";

export const addToCart = async (categoryId: string, itemId: string) => {
  return apiClient.post("/cart/add", {
    categoryId,
    itemId
  });
};

export const getCart = () => {
  return apiClient.get("/cart");
};

export const updateCartQuantity = (data: {itemId: string, quantity: number}) => {
  return apiClient.patch("/cart/quantity", data);
};