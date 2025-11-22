const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Ledger = require("../models/ledger.model");

// GET full history
router.get("/", auth, async (req, res) => {
  try {
    const { product, warehouse, type } = req.query;

    let query = {};

    if (product) query.product = product;
    if (type) query.operationType = type;
    if (warehouse)
      query.$or = [
        { fromWarehouse: warehouse },
        { toWarehouse: warehouse }
      ];

    const entries = await Ledger.find(query)
      .populate("product", "name sku")
      .populate("fromWarehouse toWarehouse", "name code")
      .sort({ createdAt: -1 });

    return res.json(entries);
  } catch (err) {
    console.error("Ledger error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
