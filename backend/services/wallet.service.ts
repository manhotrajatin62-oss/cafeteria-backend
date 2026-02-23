import { MSG } from "../constants/messages.ts";
import { walletRepo } from "../repos/wallet.repo.ts";

const addMoney = async (userId: any, amount: any) => {
  if (amount <= 0) {
    throw new Error(MSG.WALLET.INVALID_AMOUNT);
  }

  const wallet = await walletRepo.findOne({ user: userId });

  if (!wallet) {
    throw new Error(MSG.WALLET.NOT_FOUND);
  }

  wallet.balance += amount;

  await walletRepo.createWalletHistory({
    user: userId,
    wallet: wallet._id,
    type: "credit",
    amount,
    description: "Wallet recharge",
  });

  if (wallet.pendingBill > 0) {
    if (wallet.balance >= wallet.pendingBill) {
      const settlement = wallet.pendingBill;

      wallet.balance -= settlement;
      wallet.pendingBill = 0;

      await wallet.save();

      await walletRepo.createWalletHistory({
        user: userId,
        wallet: wallet._id,
        type: "debit",
        amount: settlement,
        description: "Pending bill settlement",
      });
    }
  }

  await wallet.save();

  return wallet;
};

const getWalletDetails = async (userId: any) => {
  const wallet = await walletRepo.findOne({ user: userId });

  const history = await walletRepo.findHistory({ user: userId });

  return { wallet, history };
};

export const walletService = {
  addMoney,
  getWalletDetails,
};
