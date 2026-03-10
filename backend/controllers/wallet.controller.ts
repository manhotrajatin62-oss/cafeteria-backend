import { sendResponse } from "../utils/sendResponse.ts";
import { MSG } from "../constants/messages.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { walletService } from "../services/wallet.service.ts";

export const addMoney = async (req: any, res: any) => {
  try {
    const { userId, amount } = req.body;
    const wallet = await walletService.addMoney(userId, amount);
    sendResponse(res, STATUS.OK, MSG.WALLET.MONEY_ADDED, wallet);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getWalletDetails = async (req: any, res: any) => {
  try {
    const { wallet, history } = await walletService.getWalletDetails(
      req.user.id,
    );
    sendResponse(res, STATUS.OK, MSG.WALLET.FETCHED, { wallet, history });
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getWalletCredits = async (_: any, res: any) => {
  try {
    const credits = await walletService.getWalletCredits();

    sendResponse(res, STATUS.OK, MSG.WALLET.CREDIT_HISTORY, credits);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};