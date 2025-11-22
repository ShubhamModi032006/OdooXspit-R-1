const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendOtpEmail, generateOtp } = require("../utils/sendOtp");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Step 1: Request OTP for signup
exports.requestSignupOtp = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    // Generate OTP
    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store signup data temporarily (we'll create a temporary entry or use a better approach)
    // For now, we'll create a user with emailVerified: false and store OTP
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Check if a pending signup exists
    let pendingUser = await User.findOne({ email, emailVerified: false });
    
    if (pendingUser) {
      // Update existing pending user
      pendingUser.signupOtp = otp;
      pendingUser.signupOtpExpiry = expiry;
      pendingUser.password = hashed;
      pendingUser.username = username;
      pendingUser.role = role || "staff";
      await pendingUser.save();
    } else {
      // Create new pending user
      pendingUser = await User.create({
        username,
        email,
        password: hashed,
        role: role || "staff",
        emailVerified: false,
        signupOtp: otp,
        signupOtpExpiry: expiry,
      });
    }

    // Send OTP email
    await sendOtpEmail(email, "StockMaster - Email Verification", otp, "verification");

    return res.json({ 
      message: "OTP sent to email. Please verify your email to complete signup.",
      email: email // Return email for frontend to use in verification step
    });
  } catch (err) {
    console.error("Request signup OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Step 2: Verify OTP and complete signup
exports.verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing email or OTP" });

    const user = await User.findOne({ email, emailVerified: false });
    if (!user || !user.signupOtp) return res.status(400).json({ message: "Invalid request or OTP already used" });

    if (user.signupOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.signupOtpExpiry < new Date()) return res.status(400).json({ message: "OTP expired. Please request a new one." });

    // Verify email and clear OTP
    user.emailVerified = true;
    user.signupOtp = undefined;
    user.signupOtpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user);
    return res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        emailVerified: true
      } 
    });
  } catch (err) {
    console.error("Verify signup OTP error:", err);
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

// Request OTP for password reset
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpEmail(user.email, "StockMaster - Password Reset", otp, "password-reset");
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
