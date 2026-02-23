import User from "../models/User.ts";
import Wallet from "../models/Wallet.ts";
import Order from "../models/Order.ts"

const findOrder = async (id: any) => {
  return Order.find(id).populate("items.item").sort({createdAt : -1})
};

const findOne = async (data: any) => {
  return User.findOne(data);
};

const findWallet = async (data: any) => {
  return Wallet.findOne(data);
};

const createUser = async (data: any) => {
  return User.create(data);
};

const createWallet = async (data: any) => {
  return Wallet.create(data)
};

const getMe = async (id: any) => {
  return User.findById(id);
};

export const authRepo = {
  findOne,
  createUser,
  getMe,
  createWallet,
  findWallet,
  findOrder
};
