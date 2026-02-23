import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.ts";
import {validate} from "../middleware/validateMiddleware.ts"
import {createItemSchema} from "../validations/itemValidation.ts"
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller.ts";

const router = express.Router();

router.use(authenticate);

router.get("/", getItems);
router.post("/", authorize("admin"), validate(createItemSchema), createItem);
router.patch("/:id", authorize("admin"), updateItem);
router.delete("/:id", authorize("admin"), deleteItem);

export default router