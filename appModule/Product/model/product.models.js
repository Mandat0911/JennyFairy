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
    default: ["default-image.jpg"], // Use an array as default
    validate: {
        validator: function (value) {
            return value.length > 0; // Ensures at least one image is present
        },
        message: "At least one image is required!",
    },
},

  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Other'], // Example categories
  },

  sizes: {
    type: [String], // Array of sizes (e.g., ["S", "M", "L", "XL"])
    enum: ["S", "M", "L", "XL"], // Allowed sizes
    default: [], // Default empty array if no sizes provided
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
