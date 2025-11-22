const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// Register routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

const warehouseRoutes = require("./routes/warehouse.routes");
app.use("/api/warehouses", warehouseRoutes);

const operationRoutes = require("./routes/operation.routes");
app.use("/api/operations", operationRoutes);

const ledgerRoutes = require("./routes/ledger.routes");
app.use("/api/ledger", ledgerRoutes);

const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard", dashboardRoutes);


// Default route
app.get("/", (req, res) => res.send("StockMaster Backend is Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
