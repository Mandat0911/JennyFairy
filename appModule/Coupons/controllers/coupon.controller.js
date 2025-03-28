import { appliedCouponService, createCouponService, deleteCouponService, getCouponService, validateCouponService } from "../service/coupon.service.js";

export const getCoupon = async (req, res) => {
	try {
        const userRole = req.account?.userType || "USER";
        res.status(200).json(await getCouponService(userRole));
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
	}
};

export const createCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code, discountPercentage, expirationDate} = req.body;
        res.status(200).json(await createCouponService(userId, code, discountPercentage, expirationDate ));
    } catch (error) {
        console.error("Error in createCoupon controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
        const userId = req.user.id;
        const response = await validateCouponService(userId, code)
		res.status(200).json({message: "Coupon is valid", code: response.code, discountPercentage: response.discountPercentage});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
	}
};

export const appliedCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const userId = req.user.id;
		const response = await appliedCouponService(userId, code);
        res.status(200).json({message: "Coupon applied successfully" , response});
	} catch (error) {
		console.log("Error in appliedCoupon controller", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
	}
};

export const deleteCoupon = async (req, res) => {
	try {
		const {id: couponId} = req.params;
        res.status(200).json(await deleteCouponService(couponId));
	} catch (error) {
		console.log("Error in deleteCoupon controller", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
	}
};

