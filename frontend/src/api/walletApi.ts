import apiClient from "./apiClient";

export const addMoneyToWallet = (data: { userId: string; amount: number }) => {
  return apiClient.post("/wallet/add-money", data);
};
