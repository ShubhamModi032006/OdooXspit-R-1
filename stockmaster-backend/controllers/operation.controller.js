const Operation = require("../models/operation.model");
const Ledger = require("../models/ledger.model");
const { updateStock } = require("../utils/stockUpdate");

// ------------------------------
// GET ALL OPERATIONS
// ------------------------------
exports.getOperations = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const operations = await Operation.find(query)
      .populate('createdBy', 'username email')
      .populate('validatedBy', 'username email')
      .populate('lines.product', 'name sku')
      .populate('lines.fromWarehouse', 'name code')
      .populate('lines.toWarehouse', 'name code')
      .sort({ createdAt: -1 });

    return res.json(operations);
  } catch (err) {
    console.error("Get operations error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

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

// ------------------------------
// CREATE DELIVERY
// ------------------------------
exports.createDelivery = async (req, res) => {
  try {
    const { lines, fromWarehouse } = req.body;

    if (!lines || !fromWarehouse) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const delivery = await Operation.create({
      type: "delivery",
      status: "pending",
      createdBy: req.user.userId,
      lines: lines.map((l) => ({
        product: l.product,
        qty: l.qty,
        fromWarehouse
      }))
    });

    return res.status(201).json(delivery);
  } catch (err) {
    console.error("Create delivery error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------
// VALIDATE DELIVERY
// ------------------------------
exports.validateDelivery = async (req, res) => {
  try {
    const deliveryId = req.params.id;
    const delivery = await Operation.findById(deliveryId);

    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" });

    if (delivery.status === "done")
      return res.status(400).json({ message: "Already validated" });

    for (let line of delivery.lines) {
      // reduce stock
      await updateStock(line.product, line.fromWarehouse, -line.qty);

      // ledger entry
      await Ledger.create({
        product: line.product,
        qty: -line.qty, // negative for outgoing
        fromWarehouse: line.fromWarehouse,
        toWarehouse: null,
        operationType: "delivery",
        referenceId: delivery._id
      });
    }

    delivery.status = "done";
    delivery.validatedBy = req.user.userId;
    await delivery.save();

    return res.json({
      message: "Delivery validated",
      delivery
    });
  } catch (err) {
    console.error("Validate delivery error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ------------------------------
// CREATE TRANSFER
// ------------------------------
exports.createTransfer = async (req, res) => {
  try {
    const { lines, fromWarehouse, toWarehouse } = req.body;

    if (!lines || !fromWarehouse || !toWarehouse) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transfer = await Operation.create({
      type: "transfer",
      status: "pending",
      createdBy: req.user.userId,
      lines: lines.map((l) => ({
        product: l.product,
        qty: l.qty,
        fromWarehouse,
        toWarehouse
      }))
    });

    return res.status(201).json(transfer);
  } catch (err) {
    console.error("Create transfer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------
// VALIDATE TRANSFER
// ------------------------------
exports.validateTransfer = async (req, res) => {
  try {
    const transferId = req.params.id;
    const transfer = await Operation.findById(transferId);

    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });

    if (transfer.status === "done")
      return res.status(400).json({ message: "Already validated" });

    for (let line of transfer.lines) {
      // deduct from source
      await updateStock(line.product, line.fromWarehouse, -line.qty);

      // add to destination
      await updateStock(line.product, line.toWarehouse, line.qty);

      // ledger: negative entry
      await Ledger.create({
        product: line.product,
        qty: -line.qty,
        fromWarehouse: line.fromWarehouse,
        toWarehouse: line.toWarehouse,
        operationType: "transfer",
        referenceId: transfer._id
      });

      // ledger: positive entry
      await Ledger.create({
        product: line.product,
        qty: +line.qty,
        fromWarehouse: line.fromWarehouse,
        toWarehouse: line.toWarehouse,
        operationType: "transfer",
        referenceId: transfer._id
      });
    }

    transfer.status = "done";
    transfer.validatedBy = req.user.userId;
    await transfer.save();

    return res.json({
      message: "Transfer validated",
      transfer
    });
  } catch (err) {
    console.error("Validate transfer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ------------------------------
// CREATE ADJUSTMENT
// ------------------------------
exports.createAdjustment = async (req, res) => {
  try {
    const { product, warehouse, newQty, oldQty } = req.body;

    if (!product || !warehouse || newQty === undefined || oldQty === undefined) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const qtyDiff = newQty - oldQty;

    const adjustment = await Operation.create({
      type: "adjustment",
      status: "pending",
      createdBy: req.user.userId,
      lines: [
        {
          product,
          qty: qtyDiff,
          fromWarehouse: qtyDiff < 0 ? warehouse : null,
          toWarehouse: qtyDiff >= 0 ? warehouse : null
        }
      ]
    });

    return res.status(201).json(adjustment);
  } catch (err) {
    console.error("Create adjustment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------
// VALIDATE ADJUSTMENT
// ------------------------------
exports.validateAdjustment = async (req, res) => {
  try {
    const adjustmentId = req.params.id;
    const adj = await Operation.findById(adjustmentId);

    if (!adj)
      return res.status(404).json({ message: "Adjustment not found" });

    if (adj.status === "done")
      return res.status(400).json({ message: "Already validated" });

    const line = adj.lines[0];
    const qtyChange = line.qty;

    await updateStock(line.product, line.toWarehouse || line.fromWarehouse, qtyChange);

    await Ledger.create({
      product: line.product,
      qty: qtyChange,
      fromWarehouse: line.fromWarehouse || null,
      toWarehouse: line.toWarehouse || null,
      operationType: "adjustment",
      referenceId: adj._id
    });

    adj.status = "done";
    adj.validatedBy = req.user.userId;
    await adj.save();

    return res.json({
      message: "Adjustment validated",
      adjustment: adj
    });
  } catch (err) {
    console.error("Validate adjustment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
