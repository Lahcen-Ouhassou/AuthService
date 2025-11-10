import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("PasswordReset", passwordResetSchema);
