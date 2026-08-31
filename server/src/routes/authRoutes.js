import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  loginSchema,
  registerSchema,
} from "../schemas/authSchema.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login)
);

router.get(
  "/me",
  authenticate,
  asyncHandler(authController.me)
);

export default router;