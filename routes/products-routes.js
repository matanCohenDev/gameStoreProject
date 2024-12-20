const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductSummary
} = require("../controllers/products-controller");

router.post("/createProduct", createProduct);

router.get("/getProducts", getProducts);

router.put("/updateProduct", updateProduct);

router.delete("/deleteProduct", deleteProduct);

router.get("/getSummery", getProductSummary);

module.exports = router;
