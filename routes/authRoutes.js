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


router.post("/request-reset", requestPasswordReset);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.get("/me", authMiddleware, me); // ✅ هادي اللي كانت كتخرج error


export default router;
