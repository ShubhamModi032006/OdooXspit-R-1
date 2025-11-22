const Warehouse = require("../models/warehouse.model");

// CREATE WAREHOUSE (Manager only)
exports.createWarehouse = async (req, res) => {
  try {
    const { name, code, location } = req.body;
    const userId = req.user.userId;

    if (!name || !code || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await Warehouse.findOne({ code });
    if (exists)
      return res
        .status(409)
        .json({ message: "Warehouse code already exists" });

    const warehouse = await Warehouse.create({ 
      name, 
      code, 
      location,
      createdBy: userId 
    });

    return res.status(201).json({
      message: "Warehouse created successfully",
      warehouse,
    });
  } catch (err) {
    console.error("Create warehouse error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET WAREHOUSES (Manager sees only their own)
exports.getWarehouses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let warehouses;
    if (userRole === "manager") {
      // Managers only see warehouses they created
      warehouses = await Warehouse.find({ createdBy: userId });
    } else {
      // Staff should not see warehouse list (handled in frontend)
      warehouses = [];
    }

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

// JOIN WAREHOUSE BY CODE OR NAME (Staff only)
exports.joinWarehouse = async (req, res) => {
  try {
    const { code, name } = req.body;
    const userId = req.user.userId;

    if (!code && !name) {
      return res.status(400).json({ message: "Warehouse code or name is required" });
    }

    let warehouse;
    
    // Search by code first (if provided)
    if (code) {
      warehouse = await Warehouse.findOne({ code: code.toUpperCase() });
    }
    
    // If not found by code, search by name (case-insensitive)
    if (!warehouse && name) {
      warehouse = await Warehouse.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });
    }

    if (!warehouse) {
      return res.status(404).json({ 
        message: "Warehouse not found. Please check the name or code." 
      });
    }

    // Update user's assigned warehouse
    const User = require("../models/user.model");
    await User.findByIdAndUpdate(userId, { assignedWarehouse: warehouse._id });

    return res.json({
      message: "Successfully joined warehouse",
      warehouse,
    });
  } catch (err) {
    console.error("Join warehouse error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
