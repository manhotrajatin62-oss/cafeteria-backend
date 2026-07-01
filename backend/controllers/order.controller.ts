import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import { orderService } from "../services/order.service.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import type { Request, Response } from "express";

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    await orderService.checkout(req.user.id);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const adminCheckout = async (req: Request, res: Response) => {
  try {
    await orderService.adminCheckout(req.body.userId);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.confirmOrder(req.params.orderId);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED, order);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const rejectOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.rejectOrder(req.params.orderId);
    sendResponse(res, STATUS.OK, MSG.ORDER.PLACED, order);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const listOrders = async (_: Request, res: Response) => {
  try {
    const orders = await orderService.listOrders();
    sendResponse(res, STATUS.OK, MSG.ORDER.FETCHED, orders);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};