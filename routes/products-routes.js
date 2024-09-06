const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/products-controller');

router.post('/createProduct', createProduct);

router.get('/getProducts', getProducts);

router.patch('/updateProduct', updateProduct);

router.delete('/deleteProduct', deleteProduct);

module.exports = router;
