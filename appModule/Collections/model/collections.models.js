import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },

  description: {
    type: String,
    required: [true, "Description is required!"],
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


}, { timestamps: true });

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
