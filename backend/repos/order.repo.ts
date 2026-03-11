import Item from "../models/Item.ts";
import Cart from "../models/Cart.ts";
import Category from "../models/Category.ts";
import Wallet from "../models/Wallet.ts";
import Order from "../models/Order.ts";
import WalletHistory from "../models/WalletHistory.ts"

const findCategoryId = async (id: any) => {
  return Category.findById(id);
};

const findId = async (id: any) => {
  return Item.findById(id);
};

const findOne = async (id: any) => {
  return Cart.findOne(id);
};

const findWallet = async (id: any) => {
  return Wallet.findOne(id);
};

const findOneAndPopulate = async (id: any) => {
  return Cart.findOne(id).populate("items.item");
};

const deleteOne = async (data: any) => {
  return Cart.deleteOne(data);
};

const createCart = async (data: any) => {
  return Cart.create(data);
};

const createWalletHistory = async (data: any) => {
  return WalletHistory.create(data);
};

const createOrder = async (data: any) => {
  return Order.create(data);
};

const findOrderById = async (id: any) => {
  return Order.findById(id);
};

const findAllOrders = async () => {
  return Order.find({})
    .populate("user", "name")
    .populate("items.item", "name price")
    .sort({ createdAt: -1 });
};

export const orderRepo = {
  findId,
  findOne,
  createCart,
  findOneAndPopulate,
  findCategoryId,
  findWallet,
  createOrder,
  deleteOne,
  createWalletHistory,
  findOrderById,
  findAllOrders
};
