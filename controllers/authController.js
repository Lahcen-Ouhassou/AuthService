import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mailer.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashed });

    res.json({ message: "Registered", user });
  } catch (e) {
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

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Logged in", token, user });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

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
export const me = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      message: "Authorized user",
      user,
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
