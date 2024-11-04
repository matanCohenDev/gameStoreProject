const express = require('express');
const router = express.Router();
const Product = require('../models/productsDB');
//creating a new product
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
//getting all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}
//updating a product
const updateProduct = async (req, res) => {
    const { id, price } = req.body; // Get id and price from the request body
    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        product.price = price; // Update the price with the new value
        await product.save();  // Save the updated product
        res.status(200).send(product);
        
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

//deleting a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.body.id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
}

// פונקציה לשליפת סיכום מוצרים לפי קטגוריה
// הפונקציה מבצעת שאילתת group כדי לספור כמה מוצרים יש בכל קטגוריה בטבלת "products"
const getProductSummary = async (req, res) => {
    try {
        const summary = await Product.aggregate([
            {
                // מבצע קיבוץ לפי קטגוריה ומחשב את סך המוצרים בכל קטגוריה
                $group: {
                    _id: "$category", // מקבץ לפי השדה "category"
                    count: { $sum: 1 } // סופר את מספר המוצרים באותה קטגוריה
                }
            }
        ]);
        res.json(summary);
        // מחזיר את התוצאה כ-JSON עם סיכום המוצרים לפי קטגוריה

        //res.json(summary);
    } catch (error) {
        // במקרה של שגיאה, מחזיר הודעת שגיאה עם קוד 500
        //console.log('error log'+ res);
        res.status(500).send({ error: 'Failed to retrieve product summary' });
    }
}

//exporting the functions
module.exports = { createProduct, getProducts, updateProduct, deleteProduct, getProductSummary };