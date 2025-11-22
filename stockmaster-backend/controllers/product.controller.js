const Product = require("../models/product.model");
const Warehouse = require("../models/warehouse.model");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, sku, category, unit, reorderLevel } = req.body;

    if (!name || !sku || !category || !unit) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await Product.findOne({ sku });
    if (exists)
      return res
        .status(409)
        .json({ message: "Product with this SKU already exists" });

    const product = await Product.create({
      name,
      sku,
      category,
      unit,
      reorderLevel: reorderLevel || 0,
      warehouses: [],
    });

    return res.status(201).json({
      message: "Product created",
      product,
    });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all products (with filters)
exports.getProducts = async (req, res) => {
  try {
    const { category, warehouse } = req.query;

    let query = {};
    if (category) query.category = category;
    if (warehouse) query["warehouses.warehouse"] = warehouse;

    const products = await Product.find(query).populate(
      "warehouses.warehouse",
      "name code"
    );

    return res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "warehouses.warehouse",
      "name code"
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    return res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update product (basic fields)
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, unit, reorderLevel } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, unit, reorderLevel },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Product not found" });

    return res.json({
      message: "Product updated",
      product: updated,
    });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
