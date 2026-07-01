import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import type { AuthRequest } from "../middleware/authMiddleware.ts";
import { cartService } from "../services/cart.service.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import type { Response } from "express";

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.addToCart(req.body, req.user.id);
    sendResponse(res, STATUS.OK, MSG.CART.ADDED, cart);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const updateQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.updateQuantity(req.user.id, req.body);
    sendResponse(res, STATUS.OK, MSG.CART.QUANTITY_UPDATED, cart);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user.id);

    sendResponse(res, STATUS.OK, MSG.CART.FETCHED, cart);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const deleteCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.deleteCartItem(
      req.body.itemId,
      req.user?.id,
    );

    sendResponse(res, STATUS.OK, MSG.CART.REMOVED, cart);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const cart = await cartService.clearCart(userId);

    sendResponse(res, STATUS.OK, MSG.CART.CLEARED, cart);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};
