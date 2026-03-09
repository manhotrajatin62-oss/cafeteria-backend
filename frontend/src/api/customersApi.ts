import apiClient from "./apiClient";

export const fetchAllCustomers = () => {
  return apiClient.get("/customers");
};

export const updateCustomer = (
  id: string,
  data: { name?: string; email?: string },
) => {
  return apiClient.patch(`/customers/${id}`, data);
};

export const deleteCustomer = async (id: string) => {
  return apiClient.delete(`/customers/${id}`);
};