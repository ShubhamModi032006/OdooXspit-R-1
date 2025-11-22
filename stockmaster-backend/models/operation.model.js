const mongoose = require("mongoose");

const operationLineSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  qty: { type: Number, required: true },

  // For delivery and transfer:
  fromWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse"
  },

  // For receipt and transfer:
  toWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse"
  }
});

const operationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["receipt", "delivery", "transfer", "adjustment"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "ready", "late", "done", "canceled"],
      default: "pending"
    },

    lines: [operationLineSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Operation", operationSchema);
