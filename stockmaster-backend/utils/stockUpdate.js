const Product = require("../models/product.model");

exports.updateStock = async (productId, warehouseId, qtyChange) => {
  // qtyChange: +50 for receipt, -20 for delivery, etc.
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  // look for warehouse entry
  const entry = product.warehouses.find(
    (w) => w.warehouse.toString() === warehouseId.toString()
  );

  if (entry) {
    // update existing quantity
    entry.quantity += qtyChange;
    if (entry.quantity < 0) entry.quantity = 0;
  } else {
    // add new warehouse entry
    product.warehouses.push({
      warehouse: warehouseId,
      quantity: qtyChange,
    });
  }

  await product.save();
  return product;
};
