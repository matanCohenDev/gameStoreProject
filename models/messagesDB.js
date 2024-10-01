const mongoose = require('mongoose');
//creating a schema for the messages
const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    read:{
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
//exporting the schema
module.exports = mongoose.model('Message', messageSchema);