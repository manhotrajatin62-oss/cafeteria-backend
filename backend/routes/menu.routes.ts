import express from "express";
import {authenticate} from "../middleware/authMiddleware.ts";
import {getTodayMenu} from "../controllers/menu.controller.ts"

const router = express.Router();

router.get("/today", authenticate, getTodayMenu)

export default router