import { STATUS } from "../constants/statusCodes.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import type {Request, Response, NextFunction} from "express";

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return sendResponse(res, STATUS.BAD_REQUEST, result.error);
  }
  next();
};
