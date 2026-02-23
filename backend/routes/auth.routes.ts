import express from "express";
import { validate } from "../middleware/validateMiddleware.ts";
import { register, login, getMe, requestOtp } from "../controllers/auth.controller.ts";
import { registerSchema, loginSchema } from "../validations/authValidation.ts";
import { authenticate } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);
router.post("/request-otp", requestOtp)

export default router