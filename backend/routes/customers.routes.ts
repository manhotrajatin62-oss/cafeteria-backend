import express from "express";
import {
  getCustomers,
  updateCustomerInfo,
  deleteCustomer
} from "../controllers/customers.controller.ts";
import { authenticate, authorize } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/customers", getCustomers);
router.patch("/customers/:id", updateCustomerInfo);
router.delete("/customers/:id", deleteCustomer);

export default router;
