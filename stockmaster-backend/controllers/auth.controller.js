const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendOtpEmail } = require("../utils/sendOtp");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashed, role: role || "staff" });

    const token = generateToken(user);
    return res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpEmail(user.email, "StockMaster OTP", `Your OTP is: ${otp}. Expires in 10 minutes.`);
    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("requestOtp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtpAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user || !user.otp) return res.status(400).json({ message: "Invalid request" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("verifyOtpAndReset error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
