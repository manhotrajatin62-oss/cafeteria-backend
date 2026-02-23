import { sendResponse } from "../utils/sendResponse.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import { generateToken } from "../utils/generateToken.ts";
import { authService } from "../services/auth.service.ts";
import type { AuthRequest } from "../middleware/authMiddleware.ts";

export const register = async (req: any, res: any) => {
  try {
    const user = await authService.register(req.body);

    sendResponse(res, STATUS.OK, MSG.USER.CREATED, user);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const login = async (req: any, res: any) => {
  try {
    const user = await authService.login(req.body);

    sendResponse(res, STATUS.OK, MSG.USER.LOGIN, {
      token: generateToken(user),
      user,
    });
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getMe = async (req: AuthRequest, res: any) => {
  try {
    const {user, wallet, orders} = await authService.getMe(req.user.id);
    sendResponse(res, STATUS.OK, MSG.USER.FETCHED, {
      token: generateToken(user),
      user,
      wallet,
      orders
    });
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const requestOtp = async(req:any, res:any)=> {
  try {
    const otp = await authService.requestOtp(req.body);

    sendResponse(res, STATUS.CREATED, MSG.OTP_CREATED, otp)
  } catch (err:any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message)
  }
}