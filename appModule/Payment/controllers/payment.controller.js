import { createStripeCoupon } from "../../../backend/lib/stripe/stripe.config.js";
import { stripe } from "../../../backend/lib/stripe/stripe.js";
import Coupon from "../../Coupons/model/coupon.models.js";
import dotenv from "dotenv";
import Product from "../../Product/model/product.models.js";
import Payment from "../model/payment.models.js";
import Order from "../../Order/model/order.model.js";
import User from "../../User/models/user.models.js";
import { generateVerificationToken } from "../../utils/generateVerificationCode.js";

dotenv.config();

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode, shippingDetails } = req.body;
        const userId = req.user.id;
        let totalAmount = 0;
        let coupon;
        const currentDate = new Date();

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
            return res.status(400).json({ error: "Shipping details are required" });
        }

        // Fetch full product details
        const productDetails = await Promise.all(
            products.map(async (p) => {
                const product = await Product.findById(p.productId);
                if (!product) throw new Error(`Product with ID ${p.productId} not found`);
                if (!product.price) throw new Error(`Product ${product.name} does not have a valid price`);
                return {
                    id: p.productId,
                    name: product.name,
                    price: product.price,
                    quantity: p.quantity,
                    img: product.img || [],
                };
            })
        );

        const lineItems = productDetails.map((product) => {
            const amount = Math.round(product.price);
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: product.name,
                        images: product.img.length > 0 ? [product.img[0]] : [],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        if(couponCode) {
            const usedCoupon = await Payment.findOne({ couponCode: couponCode });
            if (usedCoupon) {
                return res.status(400).json({ error: "You already used this coupon" });
            }
        }
        


        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
                expirationDate: { $gte: currentDate },
            });
            if (coupon) {
                const discount = Math.round(totalAmount * (coupon.discountPercentage / 100));
                totalAmount -= discount;
            } else {
                return res.status(400).json({ error: "Invalid or expired coupon code" });
            }
        }

        const stripeCouponId = coupon ? await createStripeCoupon(coupon.discountPercentage) : null;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
            metadata: {
                userId: userId,
                couponCode: couponCode || "",
                couponDiscountPercentage: coupon.discountPercentage,
                shippingDetails: JSON.stringify(shippingDetails),
                products: JSON.stringify(
                    productDetails.map((product) => ({
                        id: product.id,
                        price: product.price,
                        quantity: product.quantity,
                    }))
                )
            },
        });

        console.log("session:", session);

        res.status(200).json({ id: session.id, url: session.url, totalAmount: totalAmount + " VND" });
    } catch (error) {
        console.error("Error in createCheckoutSession controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;


        // Retrieve Stripe session
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const products = await JSON.parse(session.metadata.products);
        const shippingDetails = JSON.parse(session.metadata.shippingDetails);
        const sessionCouponCode = session.metadata.couponCode;

        if(session.payment_status !== "paid") {
            return res.status(400).json({ error: "Payment not completed!" });
        }

        // Check if coupon is already used by the user
        if (sessionCouponCode) {
            const existingPayment = await Payment.findOne({
                user: userId,
                couponCode: sessionCouponCode,
            });

            if (existingPayment) {
                return res.status(400).json({ error: "You already used this coupon" });
            }
        }
        
        const payment = new Payment ({
            user: userId,
            products: products.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: session.amount_total + "VND",
            paymentMethod: "Stripe",
            paymentStatus: "completed",
            isPaid: true,
            paymentDetails: {
                stripeSessionId: sessionId,
                transactionId: session.payment_intent,
                paymentError: null,
            },
            couponCode: sessionCouponCode || null,
            couponDiscountPercentage: sessionCouponCode ? session.metadata.couponDiscountPercentage : 0,
        });

        await payment.save();

            // Create order after successful payment
            const newOrder = new Order({
                user: userId,
                paymentId: payment._id,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total + " VND",
                stripeSessionId: sessionId,
                shippingDetails: shippingDetails,
            });

            await newOrder.save(); // Save order after creation

            return res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
    } catch (error) {
        console.error("Error in checkoutSuccess controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const createCheckoutQrcode = async (req, res) => {
    try {
        const {        
            products, 
            totalAmount, 
            couponCode, 
            couponDiscountPercentage, 
            Code,
            shippingDetails} = req.body;

            console.log(req.body)

        const userId = req.user.id;

        if (!products || products.length === 0 || !totalAmount || !shippingDetails) {
            return res.status(400).json({ error: "Products, totalAmount, and shipping details are required." });
        }

        const { fullName, phone, address } = shippingDetails;
        if (!fullName || !phone || !address) {
            return res.status(400).json({ error: "Full Name, Phone, and Address are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const formattedProducts = products.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            price: product.price, 
        }));

        console.log(formattedProducts)

        const randomTransactionId = generateVerificationToken(12);
        const randomStripeSessionId = generateVerificationToken(12);

        const payment = new Payment({
            user: userId,
            products: formattedProducts,
            totalAmount,
            paymentMethod: "QR code",
            paymentStatus: "pending",
            isPaid: false,
            couponCode: couponCode || "",
            couponDiscountPercentage: couponDiscountPercentage || 0,
            paymentDetails: {
                transactionId: randomTransactionId, 
                stripeSessionId: randomStripeSessionId,
                paymentError: null,
            },
        });

        await payment.save();

        console.log()


        // Create an order record with shipping details
        const order = new Order({
            user: userId,
            products: formattedProducts,
            totalAmount,
            Code: Code,
            paymentId: payment._id,
            shippingDetails: {
                fullName,
                phone,
                address,
                city: shippingDetails.city || "",
                postalCode: shippingDetails.postalCode || "",
                country: shippingDetails.country || "",
                deliveryStatus: "pending", 
            },
        });

        await order.save();

        res.status(201).json({
            message: "Qrcode Checkout Successful. Pay on delivery.",
            paymentId: payment._id,
            orderId: order._id,
        });
    } catch (error) {
        console.error("Error in createCheckoutQrcode controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}



export const createCheckoutCOD = async (req, res) => {
    try {
        const { 
             
            products, 
            totalAmount, 
            couponCode, 
            couponDiscountPercentage, 
            shippingDetails 
        } = req.body;

        const userId = req.user.id;
        // console.log(req.body)
        

        // Validate required fields
        if (!userId || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate shipping details
        const { fullName, phone, address } = shippingDetails;
        if (!fullName || !phone || !address) {
            return res.status(400).json({ error: "Full Name, Phone, and Address are required." });
        }

        // Ensure user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const formattedProducts = products.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            price: product.price, 
        }));

        const randomTransactionId = generateVerificationToken(20)
        const randomStripeSessionId = generateVerificationToken(12)

        // Create a new COD payment
        const payment = new Payment({
            user: userId,
            products: formattedProducts,
            totalAmount,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "pending",
            isPaid: false,
            couponCode: couponCode || "",
            couponDiscountPercentage: couponDiscountPercentage || 0,
            paymentDetails: {
                transactionId: randomTransactionId,
                stripeSessionId: randomStripeSessionId,
                paymentError: null,
            },
        });
        

        await payment.save();

        // Create an order record with shipping details
        const order = new Order({
            user: userId,
            products: formattedProducts,
            totalAmount,
            paymentId: payment._id,
            shippingDetails: {
                fullName,
                phone,
                address,
                city: shippingDetails.city || "",
                postalCode: shippingDetails.postalCode || "",
                country: shippingDetails.country || "",
                deliveryStatus: "pending", 
            },
        });

        await order.save();

        res.status(201).json({
            message: "COD Checkout Successful. Pay on delivery.",
            paymentId: payment._id,
            orderId: order._id,
        });
    } catch (error) {
        console.error("COD Checkout Error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};