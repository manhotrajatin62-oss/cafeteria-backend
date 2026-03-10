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

const getWalletCredits = async () => {
  const credits = await walletRepo.findWalletCredits();

  if (!credits.length) {
    throw new Error(MSG.WALLET.CREDIT_HISTORY_NOT_FOUND);
  }

  return credits.map((tx: any) => {
    const dateObj = new Date(tx.createdAt);

    const date = dateObj.toLocaleDateString("en-GB");
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();

    return {
      userName: tx.user?.name,
      creditedAmount: tx.amount,
      walletBalance: tx.wallet?.balance,
      date,
      time,
    };
  });
};

export const walletService = {
  addMoney,
  getWalletDetails,
  getWalletCredits,
};
