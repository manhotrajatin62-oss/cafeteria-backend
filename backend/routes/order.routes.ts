import express from "express";
import {
  checkout,
  adminCheckout,
  confirmOrder,
  rejectOrder,
  listOrders
} from "../controllers/order.controller.ts";

import { authenticate, authorize } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use(authenticate);

router.post("/checkout", checkout);
router.post("/admin/checkout", authorize("admin"), adminCheckout);
router.get("/list", authorize("admin"), listOrders);

router.patch(
  "/admin/:orderId/confirm",
  authorize("admin"),
  confirmOrder,
);

router.patch("/admin/:orderId/reject", authorize("admin"), rejectOrder);

export default router;
