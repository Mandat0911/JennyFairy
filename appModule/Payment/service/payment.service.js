import { stripe } from "../../../backend/lib/stripe/stripe.js";
import Coupon from "../../Coupons/model/coupon.models.js";
import dotenv from "dotenv";
import Product from "../../Product/model/product.models.js";
import {checkoutDTO} from "../dto/payment.dto.js"
import Payment from "../model/payment.models.js";
import Order from "../../Order/model/order.model.js";
import User from "../../User/models/user.models.js";
import { generateVerificationToken } from "../../utils/generateVerificationCode.js";
import { createStripeCoupon } from "../../../backend/lib/stripe/stripe.config.js";
import { sendOrderDetailSuccessEmail } from "../../utils/mail/emailSetup.js";

dotenv.config();
export const createCheckoutSessionService = async (userId, products, couponCode, shippingDetails) => {
    try {
        let totalAmount = 0;
        let coupon;
        const currentDate = new Date();
        
        if (!Array.isArray(products) || products.length === 0) {throw { status: 404, message: "Invalid or empty products array" }}

        if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {throw { status: 400, message: "Shipping details are required"  }}

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
                    size: p.size,
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

        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
                expirationDate: { $gte: currentDate },
            });
            if (coupon) {
                const discount = Math.round(totalAmount * (coupon.discountPercentage / 100));
                totalAmount -= discount;
            } else {throw { status: 400, message: "Invalid or expired coupon code"  }}
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
                couponDiscountPercentage: coupon ? coupon.discountPercentage : 0,
                shippingDetails: JSON.stringify(shippingDetails),
                products: JSON.stringify(
                    productDetails.map((product) => ({
                        productId: product.id,
                        price: product.price,
                        size: product.size,
                        quantity: product.quantity,
                    }))
                )
            },
        });

        return checkoutDTO(session, totalAmount)
    } catch (error) {
        console.error("Error in createCheckoutSessionService:", error.message);
        throw error; 
    }
};

export const checkoutSuccessService = async (userId, sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const products = await JSON.parse(session.metadata.products);
        const shippingDetails = JSON.parse(session.metadata.shippingDetails);
        const sessionCouponCode = session.metadata.couponCode;

        if(session.payment_status !== "paid") { throw { status: 400, message: "Payment not completed!"  }}

        const formattedProducts = products.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            size: products[index].size,
            price: product.price, 
        }));

        const payment = new Payment ({
            user: userId,
            products:formattedProducts,
            totalAmount: session.amount_total,
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

        const newOrder = new Order({
            user: userId,
            paymentId: payment._id,
            products: formattedProducts,
            totalAmount: session.amount_total,
            stripeSessionId: sessionId,
            shippingDetails: shippingDetails,
        });

        await newOrder.save(); 
        return newOrder._id;
    } catch (error) {
        console.error("Error in checkoutSuccessService:", error.message);
        throw error; 
    }
};

export const createCheckoutQrcodeService = async (userId, products, totalAmount, couponCode, couponDiscountPercentage, Code, shippingDetails) => {
    try {
        if (!products || products.length === 0 || !totalAmount || !shippingDetails) {throw { status: 400, message: "Products, totalAmount, and shipping details are required."  }}

        const { fullName, phone, address } = shippingDetails;
        if (!fullName || !phone || !address) {throw { status: 400, message: "Full Name, Phone, and Address are required."  }}

        const user = await User.findById(userId);
        if (!user) {throw { status: 404, message: "User not found." }}

        const formattedProducts = products.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            size: products[index].size,
            price: product.price, 
        }));
        
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
        await sendOrderDetailSuccessEmail(user.email, user.name, order); 

        return {
            paymentId: payment._id,
            orderId: order._id,
        }
    } catch (error) {
        console.error("Error in createCheckoutQrcodeService:", error.message);
        throw error; 
    }
};

export const createCheckoutPaypalCodeService = async (userId, products, totalAmount, couponCode, couponDiscountPercentage, Code, shippingDetails) => {
    try {
        if (!products || products.length === 0 || !totalAmount || !shippingDetails) {throw { status: 400, message: "Products, totalAmount, and shipping details are required."  }}

        const { fullName, phone, address } = shippingDetails;
        if (!fullName || !phone || !address) {throw { status: 400, message: "Full Name, Phone, and Address are required."  }}

        const user = await User.findById(userId);
        if (!user) {throw { status: 404, message: "User not found." }}

        const formattedProducts = products.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            size: products[index].size,
            price: product.price, 
        }));
        
        const randomTransactionId = generateVerificationToken(12);
        const randomStripeSessionId = generateVerificationToken(12);

        const payment = new Payment({
            user: userId,
            products: formattedProducts,
            totalAmount,
            paymentMethod: "Paypal",
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

        return {
            paymentId: payment._id,
            orderId: order._id,
        }
    } catch (error) {
        console.error("Error in createCheckoutPaypalCodeService:", error.message);
        throw error; 
    }
};

export const createCheckoutCODService = async (userId, products, totalAmount, couponCode, couponDiscountPercentage, shippingDetails) => {
    try {
        if (!userId || !products || products.length === 0 || !totalAmount) {throw { status: 400, message: "All fields are required."  }}

        const { fullName, phone, address } = shippingDetails;
        if (!fullName || !phone || !address) {throw { status: 400, message: "Full Name, Phone, and Address are required."  }}

        const user = await User.findById(userId);
        if (!user) {throw { status: 404, message: "User not found." }}

        const formattedProducts = products.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            size: products[index].size,
            price: product.price, 
        }));
        
        const randomTransactionId = generateVerificationToken(12);
        const randomStripeSessionId = generateVerificationToken(12);

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

        return {
            paymentId: payment._id,
            orderId: order._id,
        }
    } catch (error) {
        console.error("Error in createCheckoutCODService:", error.message);
        throw error; 
    }
};

