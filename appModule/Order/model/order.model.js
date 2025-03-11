import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    Code: {
        type: String,
        default: null,
    },
    
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            size: {
                type: String,
                required: true,
                default: "",
            },
            price: {
                type: Number,
                required: true,
                min: 1000,
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 1000,
    },

    shippingDetails :{
        fullName: {type:String, required: true},
        phone: {type: String, required: true},
        address: {type:String, require: true},
        city: {type:String, default: ""},
        postalCode: {type:String, default: ""},
        country: {type:String, default: ""},
        deliveryStatus: { 
            type: String, 
            enum: ["pending", "shipped", "delivered", "canceled"], 
            default: "pending" 
        }, 
    },

    stripeSessionId: {
        type: String,
        unique: true,
    }
}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;