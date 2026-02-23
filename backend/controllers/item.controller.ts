import { sendResponse } from "../utils/sendResponse.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import { itemService } from "../services/item.service.ts";

export const createItem = async (req: any, res: any) => {
  try {
    const item = await itemService.createItem(req.body);
    sendResponse(res, STATUS.OK, MSG.ITEM.CREATED, item);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const getItems = async (_: any, res: any) => {
  try {
    const items = await itemService.getItems();

    sendResponse(res, STATUS.OK, MSG.ITEM.FETCHED, items);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const updateItem = async (req: any, res: any) => {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);

    sendResponse(res, STATUS.OK, MSG.ITEM.UPDATED, item);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const deleteItem = async (req: any, res: any) => {
  try {
    const item = await itemService.deleteItem(req.params.id);

    sendResponse(res, STATUS.OK, MSG.ITEM.DELETED, { deletedItem: item });
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};
