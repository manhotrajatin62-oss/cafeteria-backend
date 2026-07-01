import { MSG } from "../constants/messages.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { customersService } from "../services/customers.service.ts";
import { sendResponse } from "../utils/sendResponse.ts";
import type { Request, Response } from "express";

export const getCustomers = async (_: Request, res: Response) => {
  try {
    const customers = await customersService.getCustomers();

    sendResponse(res, STATUS.OK, MSG.CUSTOMERS.FETCHED, customers);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const updateCustomerInfo = async (req: Request, res: Response) => {
  try {
    const { id }:any = req.params;
    const { name, email } = req.body;
    const updatedCustomer = await customersService.updateCustomerInfo(id, {
      name,
      email,
    });

    sendResponse(res, STATUS.OK, MSG.CUSTOMERS.UPDATED, updatedCustomer);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await customersService.deleteCustomer(id);

    sendResponse(res, STATUS.OK, MSG.CUSTOMERS.DELETED, deleted);
  } catch (err: any) {
    sendResponse(res, STATUS.BAD_REQUEST, err.message);
  }
};