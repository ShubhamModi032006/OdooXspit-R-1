const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const warehouseController = require("../controllers/warehouse.controller");

// Only managers can create new warehouses
router.post("/", auth, role("manager"), warehouseController.createWarehouse);

router.get("/", auth, warehouseController.getWarehouses);
router.get("/:id", auth, warehouseController.getWarehouseById);

module.exports = router;
