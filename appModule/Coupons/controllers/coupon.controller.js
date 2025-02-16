import Coupon from "../model/coupon.models.js";

export const getCoupon = async (req, res) => {
	try {
        const currentDate = new Date();
		const coupons = await Coupon.find({ isActive: true, expirationDate: { $gte: currentDate } });
        if (coupons.length === 0) {
            return res.status(404).json({ message: "No coupons found" });
        }
        res.status(200).json({ success: true, coupons });
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code, discountPercentage, expirationDate} = req.body;

        // Validate input fields
        if (!code || !discountPercentage || !expirationDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (discountPercentage < 0 || discountPercentage > 100) {
            return res.status(400).json({ error: "Discount percentage must be between 0 and 100" });
        }

        const existingCoupon = await Coupon.findOne({ code });

        if (existingCoupon) {
            return res.status(400).json({ error: "Coupon code already exists" });
        }

        // Create new coupon
        const newCoupon = new Coupon({
            code,
            discountPercentage,
            expirationDate,
            userId,
            isActive: true,
        });

        await newCoupon.save();

        res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        console.error("Error in createCoupon controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate.getTime() < new Date().getTime()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

		res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

