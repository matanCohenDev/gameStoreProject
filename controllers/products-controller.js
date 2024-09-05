const express = require('express');
const router = express.Router();
const Product = require('../models/productsDB');

const createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
        });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.body.id);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.category = req.body.category;
        await product.save();
        res.status(200).send(product);
    }
    catch (error) {
        res.status
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.body.id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };