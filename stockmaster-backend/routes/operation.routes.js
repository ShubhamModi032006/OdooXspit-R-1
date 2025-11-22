const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const warehouseAccess = require("../middleware/warehouseAccess.middleware");
const operationController = require("../controllers/operation.controller");

// ----------------------------------------------------
// GET ALL OPERATIONS
// ----------------------------------------------------
router.get("/", auth, operationController.getOperations);

// ----------------------------------------------------
// RECEIPT ROUTES
// ----------------------------------------------------

// Staff & Manager can create receipt, BUT restricted to staff's warehouse
router.post(
  "/receipt",
  auth,
  warehouseAccess,        // restrict staff to their assigned warehouse
  operationController.createReceipt
);

// Only manager can validate
router.patch(
  "/receipt/:id/validate",
  auth,
  role("manager"),
  operationController.validateReceipt
);

// ----------------------------------------------------
// DELIVERY ROUTES
// ----------------------------------------------------

// Staff & Manager create delivery
router.post(
  "/delivery",
  auth,
  warehouseAccess,        // staff can only deliver from their own warehouse
  operationController.createDelivery
);

// manager validates delivery
router.patch(
  "/delivery/:id/validate",
  auth,
  role("manager"),
  operationController.validateDelivery
);

// ----------------------------------------------------
// TRANSFER ROUTES
// ----------------------------------------------------

// staff can only transfer FROM their warehouse
router.post(
  "/transfer",
  auth,
  warehouseAccess,        // ensures fromWarehouse belongs to staff
  operationController.createTransfer
);

// only manager validate transfers
router.patch(
  "/transfer/:id/validate",
  auth,
  role("manager"),
  operationController.validateTransfer
);

// ----------------------------------------------------
// ADJUSTMENT ROUTES
// ----------------------------------------------------

// staff can create adjustment only for their assigned warehouse
router.post(
  "/adjustment",
  auth,
  warehouseAccess,        // ensures correct warehouse
  operationController.createAdjustment
);

// only manager validate adjustment
router.patch(
  "/adjustment/:id/validate",
  auth,
  role("manager"),
  operationController.validateAdjustment
);

module.exports = router;
