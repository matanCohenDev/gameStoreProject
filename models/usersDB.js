const mongoose = require('mongoose');
//creating a new user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roleLevel: {
        type: Number,
        required: true,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
//exporting the model
module.exports = mongoose.model('User', userSchema);

