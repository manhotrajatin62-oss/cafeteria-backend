import Order from "../models/Order.ts";
import User from "../models/User.ts";
import Wallet from "../models/Wallet.ts";

const findUsers = async (data: any) => {
  return User.find(data).sort({ createdAt: -1 });
};

const findOrder = async (id: any) => {
  return Order.find(id).populate("items.item").sort({ createdAt: -1 });
};

const findWallet = async (data: any) => {
  return Wallet.findOne(data);
};

const findIdAndUpdate = async (
  id: string,
  data: { name?: string; email?: string },
) => {
  return User.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const findIdAndDelete = async (id: string) => {
  return User.findByIdAndDelete(id);
};

export const customersRepo = {
  findUsers,
  findOrder,
  findWallet,
  findIdAndUpdate,
  findIdAndDelete
};
