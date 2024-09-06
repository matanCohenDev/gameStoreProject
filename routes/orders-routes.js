const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, deleteOrder } = require('../controllers/orders-controller');

router.post('/createOrder', createOrder);

router.get('/getOrders', getOrders);

router.patch('/updateOrder', updateOrder);

router.delete('/deleteOrder', deleteOrder);

module.exports = router;
