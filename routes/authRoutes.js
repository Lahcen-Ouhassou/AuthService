import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  me,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.get("/profile", authMiddleware, me);

export default router;
