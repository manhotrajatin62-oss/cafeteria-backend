import express from "express";
import {
  getItemCategoryAnalytics,
  getUserAnalytics,
  getOrderStats,
  getRevenueAnalytics,
  exportAnalytics
} from "../controllers/analytics.controller.ts";
import { authenticate, authorize } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/items", getItemCategoryAnalytics);
router.get("/users", getUserAnalytics);
router.get("/orders", getOrderStats);
router.get("/revenue", getRevenueAnalytics);

router.get("/:type/export", exportAnalytics)

export default router;
