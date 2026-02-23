import { sendResponse } from "../utils/sendResponse.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { MSG } from "../constants/messages.ts";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return sendResponse(res, STATUS.UNAUTHORIZED, MSG.NO_TOKEN);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
    req.user = decoded;
    next();
  } catch (err:any) {
    sendResponse(res, STATUS.UNAUTHORIZED, err.message);
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, STATUS.FORBIDDEN, MSG.FORBIDDEN);
    }
    next();
  };
