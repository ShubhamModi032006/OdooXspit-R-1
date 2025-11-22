const Operation = require("../models/operation.model");
const Ledger = require("../models/ledger.model");
const { updateStock } = require("../utils/stockUpdate");

// ------------------------------
// CREATE RECEIPT
// ------------------------------
exports.createReceipt = async (req, res) => {
  try {
    const { lines, toWarehouse } = req.body;

    if (!lines || !toWarehouse) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const receipt = await Operation.create({
      type: "receipt",
      status: "pending",
      createdBy: req.user.userId,
      lines: lines.map((l) => ({
        product: l.product,
        qty: l.qty,
        toWarehouse
      }))
    });

    return res.status(201).json(receipt);
  } catch (err) {
    console.error("Create receipt error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------
// VALIDATE RECEIPT
// ------------------------------
exports.validateReceipt = async (req, res) => {
  try {
    const receiptId = req.params.id;
    const receipt = await Operation.findById(receiptId);

    if (!receipt)
      return res.status(404).json({ message: "Receipt not found" });

    if (receipt.status === "done")
      return res.status(400).json({ message: "Already validated" });

    // Update stock for each line
    for (let line of receipt.lines) {
      await updateStock(line.product, line.toWarehouse, line.qty);

      await Ledger.create({
        product: line.product,
        qty: line.qty, // positive for stock in
        fromWarehouse: null,
        toWarehouse: line.toWarehouse,
        operationType: "receipt",
        referenceId: receipt._id
      });
    }

    receipt.status = "done";
    receipt.validatedBy = req.user.userId;
    await receipt.save();

    return res.json({
      message: "Receipt validated",
      receipt
    });
  } catch (err) {
    console.error("Receipt validation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
