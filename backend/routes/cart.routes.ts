import {validate} from "../middleware/validateMiddleware.ts";
import express from "express"
import { addCartSchema, updateQuantitySchema } from "../validations/cartValidation.ts";
import { addToCart, updateQuantity, getCart, deleteCartItem } from "../controllers/cart.controller.ts";
import { authenticate } from "../middleware/authMiddleware.ts";

const router = express.Router()

router.use(authenticate);

router.post("/add", validate(addCartSchema), addToCart)
router.patch("/quantity", validate(updateQuantitySchema), updateQuantity)
router.get("/", getCart)
router.delete("/remove", deleteCartItem)
export default router