import express from "express";
import {
  registerUser,
  loginUser,
  authorizeUser,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authorizeUser);

// Reset Password Steps
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
