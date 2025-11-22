const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Signup flow (2 steps)
router.post("/signup/request-otp", authController.requestSignupOtp);
router.post("/signup/verify-otp", authController.verifySignupOtp);

router.post("/login", authController.login);
router.post("/request-otp", authController.requestOtp); // For password reset
router.post("/verify-otp", authController.verifyOtpAndReset); // For password reset

module.exports = router;
