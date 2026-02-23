import Order from "../models/Order.ts";

const aggregateOrder = async (data: any) => {
  return Order.aggregate(data);
};

export const analyticsRepo = {
  aggregateOrder,
};
