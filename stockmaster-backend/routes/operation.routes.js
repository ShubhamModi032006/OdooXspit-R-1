const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const operationController = require("../controllers/operation.controller");

// CREATE RECEIPT (staff & managers can create)
router.post("/receipt", auth, operationController.createReceipt);

// VALIDATE RECEIPT (manager only)
router.patch("/receipt/:id/validate", auth, role("manager"), operationController.validateReceipt);

module.exports = router;
