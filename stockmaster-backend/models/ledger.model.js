const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    qty: { type: Number, required: true }, // + for in, - for out

    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null
    },

    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null
    },

    operationType: {
      type: String,
      enum: ["receipt", "delivery", "transfer", "adjustment"],
      required: true
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operation"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ledger", ledgerSchema);
