const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/products-controller');

router.post('/products', createProduct);

router.get('/products', getProducts);

router.patch('/products', updateProduct);

router.delete('/products', deleteProduct);

module.exports = router;
