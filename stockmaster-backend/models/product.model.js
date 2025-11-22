const mongoose = require("mongoose");

const productWarehouseSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    unit: { type: String, required: true }, // ex: kg, pcs, boxes
    reorderLevel: { type: Number, default: 0 },

    warehouses: [productWarehouseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
