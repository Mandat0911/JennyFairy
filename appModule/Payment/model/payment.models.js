import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
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
				price: {
					type: Number,
					required: true,
					min: 1000,
				},
			},
		],
		totalAmount: {
			type: String,
			required: true,
			min: 1000,
		},
		paymentMethod: {
			type: String,
			enum: ["Stripe", "QR code", "Cash on Delivery"], // Expand as needed
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "completed", "failed", "refunded"],
			default: "pending",
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		paidAt: {
			type: Date, // Only set when payment is successful
		},
		couponCode :{
			type: String,
			default: ""
		},

		couponDiscountPercentage: {
			type: Number,
			default: 0
		},
		paymentDetails: {
			transactionId: { type: String, unique: true || null }, // Stores Stripe Payment Intent ID or PayPal Transaction ID
			stripeSessionId: { type: String, unique: true || null }, // Only for Stripe
			paymentError: { type: String }, // Stores any payment failure messages
		},
	},
	{ timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
