const Product = require("../models/product.model");
const Operation = require("../models/operation.model");
const mongoose = require("mongoose");

// GET /api/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const { warehouse } = req.query;
    const warehouseId = warehouse ? new mongoose.Types.ObjectId(warehouse) : null;

    // 1) totalProducts - count products that have stock in the warehouse (if specified)
    let totalProductsPromise;
    if (warehouseId) {
      // Count distinct products that have this warehouse in their warehouses array
      totalProductsPromise = Product.distinct("_id", {
        "warehouses.warehouse": warehouseId
      }).then(ids => ids.length);
    } else {
      totalProductsPromise = Product.countDocuments();
    }

    // 2) totalStockQty: sum of all warehouses.quantity across all products (filtered by warehouse if specified)
    const stockQtyPipeline = [
      { $unwind: { path: "$warehouses", preserveNullAndEmptyArrays: true } }
    ];
    
    if (warehouseId) {
      stockQtyPipeline.push({
        $match: { "warehouses.warehouse": warehouseId }
      });
    }
    
    stockQtyPipeline.push(
      {
        $group: {
          _id: null,
          totalQty: { $sum: { $ifNull: ["$warehouses.quantity", 0] } }
        }
      },
      { $project: { _id: 0, totalQty: 1 } }
    );

    const totalStockQtyPromise = Product.aggregate(stockQtyPipeline);

    // 3) lowStockCount and list (products where totalQty <= reorderLevel)
    const lowStockPipeline = [
      { $unwind: { path: "$warehouses", preserveNullAndEmptyArrays: true } }
    ];
    
    if (warehouseId) {
      lowStockPipeline.push({
        $match: { "warehouses.warehouse": warehouseId }
      });
    }
    
    lowStockPipeline.push(
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          sku: { $first: "$sku" },
          reorderLevel: { $first: "$reorderLevel" },
          totalQty: { $sum: { $ifNull: ["$warehouses.quantity", 0] } }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          sku: 1,
          reorderLevel: 1,
          totalQty: 1,
          isLow: { $lte: ["$totalQty", { $ifNull: ["$reorderLevel", 0] }] }
        }
      },
      { $match: { isLow: true } },
      { $sort: { totalQty: 1 } }, // smallest stock first
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          items: {
            $push: {
              id: "$_id",
              name: "$name",
              sku: "$sku",
              totalQty: "$totalQty",
              reorderLevel: "$reorderLevel"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          count: 1,
          items: { $slice: ["$items", 10] } // top 10 low stock items
        }
      }
    );

    const lowStockAggPromise = Product.aggregate(lowStockPipeline);

    // 4) pending receipts/deliveries/transfers counts (filtered by warehouse if specified)
    const pendingStatuses = ["pending", "ready"];
    
    // Build operation match query
    const operationMatch = { status: { $in: pendingStatuses } };
    if (warehouseId) {
      // For operations, we need to check lines array
      operationMatch["$or"] = [
        { "lines.toWarehouse": warehouseId },
        { "lines.fromWarehouse": warehouseId }
      ];
    }

    const pendingReceiptsQuery = { ...operationMatch, type: "receipt" };
    const pendingDeliveriesQuery = { ...operationMatch, type: "delivery" };
    const pendingTransfersQuery = { ...operationMatch, type: "transfer" };

    const pendingReceiptsPromise = Operation.countDocuments(pendingReceiptsQuery);
    const pendingDeliveriesPromise = Operation.countDocuments(pendingDeliveriesQuery);
    const pendingTransfersPromise = Operation.countDocuments(pendingTransfersQuery);

    // Execute all promises in parallel
    const [
      totalProducts,
      totalStockAgg,
      lowStockAgg,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers
    ] = await Promise.all([
      totalProductsPromise,
      totalStockQtyPromise,
      lowStockAggPromise,
      pendingReceiptsPromise,
      pendingDeliveriesPromise,
      pendingTransfersPromise
    ]);

    const totalStockQty = (totalStockAgg && totalStockAgg[0] && totalStockAgg[0].totalQty) || 0;
    const lowStockCount = (lowStockAgg && lowStockAgg[0] && lowStockAgg[0].count) || 0;
    const lowStockItems = (lowStockAgg && lowStockAgg[0] && lowStockAgg[0].items) || [];

    return res.json({
      totalProducts,
      totalStockQty,
      lowStockCount,
      lowStockItems,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
