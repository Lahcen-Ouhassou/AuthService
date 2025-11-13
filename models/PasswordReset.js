import mongoose from "mongoose";
// هاد الملف مسؤول على حفظ أكواد reset ديال "نسيت كلمة السر".

const resetSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
});

export default mongoose.model("PasswordReset", resetSchema);
