import mongoose from "mongoose";

const resetSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
});

export default mongoose.model("PasswordReset", resetSchema);
