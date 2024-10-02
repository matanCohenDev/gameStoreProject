const express = require('express');
const router = express.Router();
const Order = require('../models/ordersDB');
const Product = require('../models/productsDB');
const User = require('../models/usersDB');

//creating a new order
const createOrder = async (req, res) => {
    try {
        const { userId, productIds } = req.body;

        // Fetch the user to get the username
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Fetch product details
        const products = await Product.find({ _id: { $in: productIds } });

        // Map the products to include name and price
        const orderProducts = products.map(product => ({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1 // Adjust quantity as needed
        }));

        const order = new Order({
            user: user.username,
            products: orderProducts,
        });
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(400).send(error);
    }
}

//getting all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
}
//updating an order
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.body.id);
        order.user = req.body.user;
        order.product = req.body.product;
        order.quantity = req.body.quantity;
        await order.save();
        res.status(200).send(order);
    }
    catch (error) {
        res.status(400).send(error);
    }
}
//deleting an order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.body.id);
        res.status(200).send(order);
    }
    catch (error) {
        res.status(500).send(error);
    }
}
//exporting the functions
module.exports = { createOrder, getOrders, updateOrder, deleteOrder };

