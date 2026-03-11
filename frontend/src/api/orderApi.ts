import apiClient from "./apiClient";

export const checkout = () => {
  return apiClient.post("/order/checkout");
};

export const getOrders = () => {
  return apiClient.get("/order/list");
};

export const confirmOrder = (orderId: string) => {
  return apiClient.patch(`/order/admin/${orderId}/confirm`);
};

export const rejectOrder = (orderId: string) => {
  return apiClient.patch(`/order/admin/${orderId}/reject`);
};