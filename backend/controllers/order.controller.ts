import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import { orderService } from "../services/order.service.ts";
import { sendResponse } from "../utils/sendResponse.ts";

export const checkout = async (req: any, res: any) => {
  try {
    await orderService.checkout(req.user.id);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const adminCheckout = async (req: any, res: any) => {
  try {
    await orderService.adminCheckout(req.body.userId);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const confirmOrder = async (req: any, res: any) => {
  try {
    const order = await orderService.confirmOrder(req.params.orderId);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED, order);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const rejectOrder = async (req: any, res: any) => {
  try {
    const order = await orderService.rejectOrder(req.params.orderId);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED, order);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};
