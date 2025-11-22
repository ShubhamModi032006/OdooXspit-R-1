const Warehouse = require("../models/warehouse.model");

// CREATE WAREHOUSE
exports.createWarehouse = async (req, res) => {
  try {
    const { name, code, location } = req.body;

    if (!name || !code || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await Warehouse.findOne({ code });
    if (exists)
      return res
        .status(409)
        .json({ message: "Warehouse code already exists" });

    const warehouse = await Warehouse.create({ name, code, location });

    return res.status(201).json({
      message: "Warehouse created successfully",
      warehouse,
    });
  } catch (err) {
    console.error("Create warehouse error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET ALL WAREHOUSES
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    return res.json(warehouses);
  } catch (err) {
    console.error("Get warehouses error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE WAREHOUSE
exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    return res.json(warehouse);
  } catch (err) {
    console.error("Get warehouse error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
