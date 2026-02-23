import { sendResponse } from "../utils/sendResponse.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import { menuService } from "../services/menu.service.ts";

export const getTodayMenu = async (_: any, res: any) => {
  try {
    const categories = await menuService.getTodayMenu();
    sendResponse(res, STATUS.OK, MSG.MENU.FETCHED, categories);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};
