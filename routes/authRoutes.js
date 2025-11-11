import express from "express";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  me,
} from "../controllers/authController.js";

import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ مهم جدا

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.get("/profile", authMiddleware, me); 

export default router;
