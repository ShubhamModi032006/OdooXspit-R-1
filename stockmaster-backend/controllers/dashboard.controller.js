const Product = require("../models/product.model");
const Operation = require("../models/operation.model");

// GET /api/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    // 1) totalProducts
    const totalProductsPromise = Product.countDocuments();

    // 2) totalStockQty: sum of all warehouses.quantity across all products
    const totalStockQtyPromise = Product.aggregate([
      { $unwind: { path: "$warehouses", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalQty: { $sum: { $ifNull: ["$warehouses.quantity", 0] } }
        }
      },
      { $project: { _id: 0, totalQty: 1 } }
    ]);

    // 3) lowStockCount and list (products where totalQty <= reorderLevel)
    const lowStockAggPromise = Product.aggregate([
      { $unwind: { path: "$warehouses", preserveNullAndEmptyArrays: true } },
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
    ]);

    // 4) pending receipts/deliveries/transfers counts
    const pendingStatuses = ["pending", "ready"];
    const pendingReceiptsPromise = Operation.countDocuments({
      type: "receipt",
      status: { $in: pendingStatuses }
    });
    const pendingDeliveriesPromise = Operation.countDocuments({
      type: "delivery",
      status: { $in: pendingStatuses }
    });
    const pendingTransfersPromise = Operation.countDocuments({
      type: "transfer",
      status: { $in: pendingStatuses }
    });

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
