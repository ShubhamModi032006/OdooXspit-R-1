const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
