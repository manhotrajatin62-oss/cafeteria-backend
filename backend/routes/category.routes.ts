import express from "express";
import {
  createCategory,
  addItemToCategory,
  getCategories,
  removeItemFromCategory,
  deleteCategory
} from "../controllers/category.controller.ts";
import {validate} from "../middleware/validateMiddleware.ts"
import {createCategorySchema} from "../validations/categoryValidation.ts"
import { authenticate, authorize } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.post("/", validate(createCategorySchema), createCategory);
router.get("/", getCategories);
router.post("/add-item", addItemToCategory);
router.delete("/delete-item", removeItemFromCategory);
router.delete("/delete", deleteCategory)

export default router;
