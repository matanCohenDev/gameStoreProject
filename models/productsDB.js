const mongoose = require("mongoose");
//creating a new product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Memory", "Board", "Cards", "Startegy"],
    default: "Memory",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//exporting the model
module.exports = mongoose.model("Product", productSchema);
