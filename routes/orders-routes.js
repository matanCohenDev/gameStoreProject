const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, deleteOrder } = require('../controllers/orders-controller');

router.post('/orders', createOrder);

router.get('/orders', getOrders);

router.patch('/orders', updateOrder);

router.delete('/orders', deleteOrder);

module.exports = router;
