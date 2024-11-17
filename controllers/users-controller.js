const bcrypt = require('bcryptjs');
const User = require('../models/usersDB');
const Product = require('../models/productsDB');
const mongoose = require('mongoose');

//creating a new user
const createUser = async (req, res) => {
    try {
        console.log(req.body); 
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            products: []
        });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error); 
        res.status(400).send({ msg: 'Error creating user' });
    }
};
//login
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            req.session.user = user;
            res.status(200).json({ msg: 'Login successful', user: user.username });
        } else {
            res.status(400).json({ msg: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

//getting the current user
const currentUser = async (req, res) => {
    try {
        if (req.session.userId) {
            const current = await User.findById(req.session.userId);
            res.status(200).send({ userId: current._id, username: current.username, products: current.products });
        } else {
            res.status(401).send({ msg: 'No user logged in' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

//getting all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};
//updating a user
const updateUser = async (req, res) => {
    try {
        let updateData = {
            username: req.body.username,
            email: req.body.email,
            roleLevel: req.body.roleLevel,
        };

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            updateData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(req.body.id, updateData, { new: true });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
//deleting a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
//logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.clearCookie('connect.sid');
        res.status(200).send('Logged out');
    }
    );
}

//add products to user (if not contains)
// controllers/userController.js

// פונקציה להוספת מוצרים למערך products של המשתמש, רק אם הם לא קיימים שם לפי id
async function addProductsToUser(req, res) {
    try {
        console.log("addProductsToUser try");
        const { userId, newproducts } = req.body; // מקבל מזהה משתמש ומערך מוצרים מהבקשה
        console.log("userId:", userId, "newproducts:", newproducts);

        // בדיקה ש-userId תקין
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: 'Invalid userId' });
        }

        const currentuser = await User.findById(userId);
        if (!currentuser) {
            return res.status(404).send({ error: 'User not found' });
        }

        // בדיקה ש-newproducts הוא מערך
        if (!Array.isArray(newproducts) || newproducts.length === 0) {
            return res.status(400).send({ error: 'newproducts must be a non-empty array' });
        }

        // Fetch product details
        const products = await Product.find({ _id: { $in: newproducts } });
        console.log("products:", products);

        // בדיקה אם לא נמצאו מוצרים תואמים
        if (!products || products.length === 0) {
            return res.status(404).send({ error: 'No matching products found' });
        }

        // Map the products to include name, price, and quantity
        const userProducts = products.map(product => ({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1 // Adjust quantity as needed
        }));
        console.log("userProducts:", userProducts);

        // עדכון המשתמש עם הוספת המוצרים הייחודיים למערך
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { products: { $each: userProducts } } }, // משתמש במערך המעובד `userProducts`
            { new: true } // מחזיר את המסמך המעודכן
        );

        res.status(200).json(user); // מחזיר את המשתמש המעודכן

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add unique products to user' });
    }
}

//מחיקת מוצר מהמערך מוצרים של כל המשתמשים
const deleteProductFromUser = async (req, res) => {
    console.log("deleteProductsToUser try");
    const { productId } = req.body; // מקבל מזהה משתמש ומערך מוצרים מהבקשה

    try {
        const result = await User.updateMany(
            {}, //אין תנאי חיפוש- פועל על כל הטבלה
            { $pull: { products: { productId: productId } } },
            { new: true }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send({ success: true, message: "Product removed from all users" });
        } else {
            res.status(404).send({ success: false, message: "Product not found in any user" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product from user' });
    }
}

//exporting the functions
module.exports = { createUser, getUsers, updateUser, deleteUser, loginUser , logout , currentUser, addProductsToUser, deleteProductFromUser};