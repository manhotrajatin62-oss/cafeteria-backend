import { sendResponse } from "../utils/sendResponse.ts";
import { MSG } from "../constants/messages.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { categoryService } from "../services/category.service.ts";
import type { Request, Response } from "express";

export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();

    sendResponse(res, STATUS.OK, MSG.CATEGORY.FETCHED, categories);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);

    sendResponse(res, STATUS.CREATED, MSG.CATEGORY.CREATED, category);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const addItemToCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.addItemToCategory(req.body);

    sendResponse(res, STATUS.OK, MSG.CATEGORY.ADDED, category);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const removeItemFromCategory = async (req: Request, res: Response) => {
  try {
    const item = await categoryService.removeItemFromCategory(req.body);

    sendResponse(res, STATUS.OK, MSG.CATEGORY.ITEM_REMOVED, item);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const deleteCategory = async (req:Request, res:Response) => {
  try {
    const deleted = await categoryService.deleteCategory(req.body);

    sendResponse(res, STATUS.OK, MSG.CATEGORY.DELETED, deleted)
  } catch (err:any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message)
  }
}