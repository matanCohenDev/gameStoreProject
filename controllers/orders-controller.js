const express = require('express');
const router = express.Router();
const Order = require('../models/ordersDB');

const createOrder = async (req, res) => {
    try {
        const order = new Order({
            user: req.body.user,
            product: req.body.product,
            quantity: req.body.quantity,
        });
        await order.save();
        res.status(201).send(order);
    }
    catch (error) {
        res.status(400).send(error);
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
}

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

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.body.id);
        res.status(200).send(order);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };

