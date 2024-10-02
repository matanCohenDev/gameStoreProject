const mongoose = require('mongoose');
//creating a new order schema
const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
   
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                default: 1,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

//exporting the model
module.exports = mongoose.model('Order', orderSchema);
