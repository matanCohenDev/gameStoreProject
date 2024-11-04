const express = require("express");
const router = express.Router();
const Order = require("../models/ordersDB");

// Route to fetch order statistics by date
router.get("/by-date", async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by exact date
          totalAmount: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          averageOrderAmount: { $divide: ["$totalAmount", "$orderCount"] },
        },
      },
      { $sort: { date: 1 } }, // Sort by date
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
});

module.exports = router;