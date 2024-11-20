const express = require("express");
const router = express.Router();
const { byDate, productsOrdersStats } = require("../controllers/orders-stats-controller");

// Route to fetch total profit by date for the last two weeks
router.get("/by-date", byDate);

// Route to fetch the number of orders per product
router.get("/products-orders-stats", productsOrdersStats);

module.exports = router;
