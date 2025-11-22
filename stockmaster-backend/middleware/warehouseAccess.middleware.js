const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  // manager has full access
  if (req.user.role === "manager") return next();

  const user = await User.findById(req.user.userId);

  if (!user || !user.assignedWarehouse) {
    return res.status(403).json({ message: "Staff has no assigned warehouse" });
  }

  // Extract warehouse from payload
  const { fromWarehouse, toWarehouse, warehouse } = req.body;

  const targetWarehouse =
    fromWarehouse || toWarehouse || warehouse || null;

  if (!targetWarehouse) {
    return res.status(400).json({ message: "Operation must specify warehouse" });
  }

  // Staff can only operate in their assigned warehouse
  if (user.assignedWarehouse.toString() !== targetWarehouse.toString()) {
    return res.status(403).json({
      message: "You are not allowed to operate on this warehouse"
    });
  }

  next();
};
