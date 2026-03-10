import Wallet from "../models/Wallet.ts";
import WalletHistory from "../models/WalletHistory.ts";

const findOne = async (id: any) => {
  return Wallet.findOne(id);
};

const findHistory = async (id: any) => {
  return WalletHistory.find(id).sort({ createdAt: -1 });
};

const createWalletHistory = async (data: any) => {
  return WalletHistory.create(data);
};

const findWalletCredits = async () => {
  return WalletHistory.find({ type: "credit" })
    .populate("user", "name")
    .populate("wallet", "balance")
    .sort({ createdAt: -1 });
};

export const walletRepo = {
  findOne,
  createWalletHistory,
  findHistory,
  findWalletCredits
};
