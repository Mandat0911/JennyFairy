import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },

  description: {
    type: String,
    required: [true, "Description is required!"],
  },

  price: {
    type: Number,
    required: [true, "Price is required!"],
    min: [0, "Price must be a positive number"],
  },

  img: {
    type: [String],
    default: ['default-image.jpg'], // Default image if none provided
    required: [true, "Image is required!"],
  },

  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Other'], // Example categories
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
