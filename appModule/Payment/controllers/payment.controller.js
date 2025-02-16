import { createStripeCoupon } from "../../../backend/lib/stripe/stripe.config.js";
import { stripe } from "../../../backend/lib/stripe/stripe.js";
import Coupon from "../../Coupons/model/coupon.models.js";
import dotenv from "dotenv";

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

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: product.img ? [product.img] : [],
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
                totalAmount -= Math.round(totalAmount * (1 - coupon.discountPercentage / 100));
            }
        }

        const stripeCouponId = coupon ? await createStripeCoupon(coupon.discountPercentage) : null;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECK_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
            metadata: {
                userId: userId,
                couponCode: couponCode || "",
            },
        });

        res.status(200).json({ id: session.id, url: session.url, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error in createCheckoutSession controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};
