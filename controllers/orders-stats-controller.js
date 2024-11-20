const express = require("express");
const Order = require("../models/ordersDB");
const router = express.Router();


const byDate = async (req, res) => {
    try {
      // Calculate the date two weeks ago
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
      // Aggregation pipeline for calculating total profit by date
      const stats = await Order.aggregate([
        { $match: { createdAt: { $gte: twoWeeksAgo } } }, // Filter orders from the last two weeks
        { $unwind: "$products" }, // Deconstruct the products array
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
            totalProfit: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }, // Calculate total profit
          },
        },
        {
          $project: {
            date: "$_id",
            totalProfit: 1,
          },
        },
        { $sort: { date: 1 } }, // Sort by date in ascending order
      ]);
  
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error); // Log error for debugging
      res.status(500).json({ message: "Error fetching statistics", error });
    }
  };

  const productsOrdersStats = async (req, res) => {
    try {
      // Aggregation pipeline for calculating order count per product
      const stats = await Order.aggregate([
        { $unwind: "$products" }, // Deconstruct the products array
        {
          $group: {
            _id: "$products.name", // Group by product name
            orderCount: { $sum: "$products.quantity" }, // Sum quantity to get order count
          },
        },
        {
          $project: {
            productName: "$_id",
            orderCount: { $toInt: "$orderCount" }, // Ensure orderCount is an integer
          },
        },
        { $sort: { orderCount: -1 } }, // Sort by order count in descending order
      ]);
  
      res.json(stats);
    } catch (error) {
      console.error("Error fetching product orders statistics:", error); // Log error for debugging
      res.status(500).json({ message: "Error fetching product orders statistics", error });
    }
  };

    module.exports = { byDate, productsOrdersStats };