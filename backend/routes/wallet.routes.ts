import express from "express";
import {addMoney, getWalletDetails} from "../controllers/wallet.controller.ts"
import { authenticate } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.use(authenticate)

router.post("/add-money", addMoney);
router.get("/", getWalletDetails)

export default router