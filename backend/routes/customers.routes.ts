import express from "express";
import {
  getCustomers,
  updateCustomerInfo,
  deleteCustomer
} from "../controllers/customers.controller.ts";
import { authenticate, authorize } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", getCustomers);
router.patch("/:id", updateCustomerInfo);
router.delete("/:id", deleteCustomer);

export default router;
