import { sendResponse } from "../utils/sendResponse.ts";
import { MSG } from "../constants/messages.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { categoryService } from "../services/category.service.ts";

export const getCategories = async (_: any, res: any) => {
  try {
    const categories = await categoryService.getCategories();

    sendResponse(res, STATUS.OK, MSG.CATEGORY.FETCHED, categories);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const createCategory = async (req: any, res: any) => {
  try {
    const category = await categoryService.createCategory(req.body);

    sendResponse(res, STATUS.CREATED, MSG.CATEGORY.CREATED, category);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const addItemToCategory = async (req: any, res: any) => {
  try {
    const category = await categoryService.addItemToCategory(req.body);

    sendResponse(res, STATUS.OK, MSG.CATEGORY.ADDED, category);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const removeItemFromCategory = async (req: any, res: any) => {
  try {
    const item = await categoryService.removeItemFromCategory(req.body);

    sendResponse(res, STATUS.OK, MSG.CATEGORY.ITEM_REMOVED, item);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const deleteCategory = async (req:any, res:any) => {
  try {
    const deleted = await categoryService.deleteCategory(req.body);

    sendResponse(res, STATUS.OK, MSG.CATEGORY.DELETED, deleted)
  } catch (err:any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message)
  }
}