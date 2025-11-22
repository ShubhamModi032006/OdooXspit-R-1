const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const operationController = require("../controllers/operation.controller");

// CREATE RECEIPT (staff & managers can create)
router.post("/receipt", auth, operationController.createReceipt);

// VALIDATE RECEIPT (manager only)
router.patch("/receipt/:id/validate", auth, role("manager"), operationController.validateReceipt);

// CREATE DELIVERY (staff + manager)
router.post("/delivery", auth, operationController.createDelivery);

// VALIDATE DELIVERY (manager only)
router.patch("/delivery/:id/validate", auth, role("manager"), operationController.validateDelivery);

// CREATE TRANSFER (staff + manager)
router.post("/transfer", auth, operationController.createTransfer);

// VALIDATE TRANSFER (manager)
router.patch("/transfer/:id/validate", auth, role("manager"), operationController.validateTransfer);

// CREATE ADJUSTMENT (staff + manager)
router.post("/adjustment", auth, operationController.createAdjustment);

// VALIDATE ADJUSTMENT (manager)
router.patch("/adjustment/:id/validate", auth, role("manager"), operationController.validateAdjustment);



module.exports = router;
