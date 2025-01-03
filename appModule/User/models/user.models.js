import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is require!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        lowercase: true,
        trim: true,
        unique: true,
      },

    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            }
        }
    ],

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;