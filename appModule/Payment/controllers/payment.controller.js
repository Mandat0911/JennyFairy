import { createStripeCoupon } from "../../../backend/lib/stripe/stripe.config.js";
import { stripe } from "../../../backend/lib/stripe/stripe.js";
import Coupon from "../../Coupons/model/coupon.models.js";
import dotenv from "dotenv";
import Product from "../../Product/model/product.models.js";
import Payment from "../model/payment.models.js";
import Order from "../../Order/model/order.model.js";

dotenv.config();

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        const userId = req.user.id;
        let totalAmount = 0;
        let coupon = null;
        const currentDate = new Date();

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
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

        
            const usedCoupon = await Payment.findOne({
                couponCode: couponCode,
            });

            if (usedCoupon) {
                return res.status(400).json({ error: "You already used this coupon" });
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
            }else {
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
                products: JSON.stringify(
                    productDetails.map((product) => ({
                        id: product.id,
                        price: product.price,
                        quantity: product.quantity,
                    }))
                )
            },
        });

        console.log("session:", session)


        const formattedProducts = productDetails.map((product, index) => ({
            product: products[index].productId, 
            quantity: products[index].quantity,
            price: product.price, 
        }));

        // Save payment details along with coupon applied
        const payment = new Payment({
            user: userId,
            products: formattedProducts,
            totalAmount: totalAmount + " VND",
            paymentMethod: "Stripe",
            paymentStatus: "pending",
            isPaid: false,
            paymentDetails: {
                stripeSessionId: session.id,
                transactionId: session.payment_intent || session.id,  // Using payment_intent for the transaction ID
            paymentError: null,
            },
            couponCode: null,
            couponDiscountPercentage: coupon ? coupon.discountPercentage : 0
        });

        await payment.save();

        // Further function: If the totalAmount > xxx auto generate coupons
        res.status(200).json({ id: session.id, url: session.url, totalAmount: totalAmount + " VND"});
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
    
        const sessionCouponCode = session.metadata.couponCode;
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
        // Proceed only if payment is successful
        if (session.payment_status === "paid") {
            // Update the Payment record with the coupon code
            const updatedPayment = await Payment.findOneAndUpdate(
                { "paymentDetails.transactionId": sessionId },
                { couponCode: sessionCouponCode,
                    isPaid: true,
                     paymentStatus: "completed"
                 },
                { new: true }
            );

            if (!updatedPayment) {
                return res.status(404).json({ error: "Payment record not found!" });
            }

            // Create order after successful payment
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total + " VND",
                stripeSessionId: sessionId,
            });

            await newOrder.save(); // Save order after creation

            return res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        } else {
            return res.status(400).json({ error: "Payment not completed!" });
        }
    } catch (error) {
        console.error("Error in checkoutSuccess controller:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};




