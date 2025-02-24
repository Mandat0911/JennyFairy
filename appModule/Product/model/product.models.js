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
    min: [1000, "Price must be at least 1,000 VND"], // Set minimum price
    validate: {
      validator: function (v) {
        return Number.isInteger(v); // Ensure price is an integer
      },
      message: "Price must be a whole number in VND",
    },
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

  quantity: {
    type: Number,
    default: 0,
    required: true
  },

  category: {
    type: [String],
    default: [],
    required: true,
  },

  sizes: {
    type: [String], // Array of sizes (e.g., ["S", "M", "L", "XL"])
    default: [], // Default empty array if no sizes provided
    required: true,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
