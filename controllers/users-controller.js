const bcrypt = require('bcryptjs');
const User = require('../models/usersDB');
//creating a new user
const createUser = async (req, res) => {
    try {
        console.log(req.body); 
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
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
            return res.status(400).json({msg: 'User not found'});
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            req.session.user = user;
            res.status(200).json({ msg: 'Login successful', user: user.username });
        } else {
            res.status(400).json({msg: 'Invalid credentials'});
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

//exporting the functions
module.exports = { createUser, getUsers, updateUser, deleteUser, loginUser , logout};
