const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const productController = require("../controllers/product.controller");

// Only managers can create or update products
router.post("/", auth, role("manager"), productController.createProduct);

router.get("/", auth, productController.getProducts);
router.get("/:id", auth, productController.getProductById);

router.patch("/:id", auth, role("manager"), productController.updateProduct);

module.exports = router;
