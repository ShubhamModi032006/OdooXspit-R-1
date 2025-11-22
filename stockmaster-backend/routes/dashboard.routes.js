const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

// Protected: any authenticated user can view KPIs.
// If you want only managers, add role("manager") middleware.
router.get("/summary", auth, dashboardController.getDashboardSummary);

module.exports = router;
