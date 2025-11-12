import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mailer.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashed,
      verificationToken,
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });

    const verifyLink = `http://localhost:5000/auth/verify-email/${verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `
      <h2>Welcome ${username}</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verifyLink}" 
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
      `
    );

    res.json({
      message:
        "Registered successfully. Check your email to verify your account.",
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("📩 Verification token received:", token);

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ No user found or token expired");
      return res
        .status(400)
        .send("<h2>Invalid or expired verification link.</h2>");
    }

    // ✅ Update the user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    console.log("✅ Email verified for:", user.email);

    // Response with simple success page
    res.send(`
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f4f4f4;">
        <h2 style="color:green;">✅ Email verified successfully!</h2>
        <p>You can now log in to your account.</p>
      </div>
    `);
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Add this check
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Logged in", token, user });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordReset.create({
      email,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Your reset code",
      `<h1>${code}</h1><p>Code expires in 10 minutes</p>`
    );

    res.json({ message: "Code sent" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Reset Code
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await PasswordReset.findOne({ email, code });
    if (!record) return res.status(400).json({ message: "Invalid code" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ message: "Code expired" });

    res.json({ message: "Code valid" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const record = await PasswordReset.findOne({ email, code });
    if (!record) return res.status(400).json({ message: "Invalid code" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ message: "Code expired" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashed });

    await PasswordReset.deleteMany({ email });

    res.json({ message: "Password updated" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// Me
export const me = async (req, res) => {
  try {
    // req.user فيه غير id
    const userId = req.user.id;

    // نجيب اليوزر الحقيقي من MongoDB
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Authorized user",
      user,
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
