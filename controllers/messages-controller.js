const express = require('express');
const router = express.Router();
const Message = require('../models/messagesDB');

//creating a new message
const createMessage = async (req, res) => {
    try {
        const message = new Message({
            message: req.body.message,
            sender: req.body.sender,
            receiver: req.body.receiver,
        });
        await message.save();
        res.status(201).send(message);
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//getting all messages
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).send(messages);
    } catch (error) {
        res.send(500).send(error);
    }
}

//updating a message
const updateMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.body.id);
        message.message = req.body.message;
        message.sender = req.body.sender;
        message.receiver = req.body.receiver;
        await message.save();
        res.status(200).send(message);
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//deleting a message
const deleteMessage = async (req, res) => {
    try {
        const message = await findByIdAndDelete(req.body.id);
        res.status(200).send(message);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

//exporting the functions
module.exports = { createMessage, getMessages, updateMessage, deleteMessage };
