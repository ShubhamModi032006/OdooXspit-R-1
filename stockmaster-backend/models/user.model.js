const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["manager", "staff"], default: "staff" },
    emailVerified: { type: Boolean, default: false },

    assignedWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null
    },

    otp: String,
    otpExpiry: Date,
    signupOtp: String, // OTP for email verification during signup
    signupOtpExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
