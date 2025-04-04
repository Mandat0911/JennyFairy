import { couponDTO } from "../dto/coupon.dto.js";
import Coupon from "../model/coupon.models.js";

export const getCouponService = async (userRole) => {
    try {
        const currentDate = new Date();

        const coupons = userRole === "ADMIN" || userRole === "MANAGER" ? await Coupon.find() : await Coupon.find({ isActive: true, expirationDate: { $gte: currentDate }});
        const formattedCoupons = coupons.map((coupon) => couponDTO(coupon))
        return formattedCoupons;
    } catch (error) {
        console.error("Error in getCouponService:", error.message);
        throw error; 
    }
};

export const appliedCouponService = async (userId, code) => {
    try {
		const coupon = await Coupon.findOne({code});
        if (!coupon) {throw { status: 404, message: "No coupons found" }}

        coupon.usedBy.push(userId);
        await coupon.save();
    } catch (error) {
        console.error("Error in appliedCouponService:", error.message);
        throw error; 
    }
};

export const deleteCouponService = async (couponId) => {
    try {
		const deleteCoupon = await Coupon.findByIdAndDelete(couponId);
		if (!deleteCoupon) {throw { status: 404, message: "No coupons found" }}
    } catch (error) {
        console.error("Error in deleteCouponService:", error.message);
        throw error; 
    }
};

export const validateCouponService = async (userId, code) => {
    try {
		const coupon = await Coupon.findOne({ code: code, isActive: true });
        if (!coupon) {throw { status: 404, message: "No coupons found" }}
        if (coupon.expirationDate.getTime() < new Date().getTime()) {throw { status: 400, message: "Coupon has expired" }}
        if (coupon.usedBy.includes(userId)) {throw { status: 400, message: "Coupon has already been used"}};

        return couponDTO(coupon);
    } catch (error) {
        console.error("Error in validateCouponService:", error.message);
        throw error; 
    }
};

export const createCouponService = async (userId, code, discountPercentage, expirationDate) => {
    try {
        if (!code || !discountPercentage || !expirationDate) {throw { status: 400, message: "All fields are required" }}
        if (discountPercentage < 0 || discountPercentage > 100) {throw { status: 400, message: "Discount percentage must be between 0 and 100" }}

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {throw { status: 400, message: "Coupon code already exists" }}

        const newCoupon = new Coupon({code, discountPercentage, expirationDate, userId, isActive: true});
        await newCoupon.save();

        return couponDTO(newCoupon);
    } catch (error) {
        console.error("Error in createCouponService:", error.message);
        throw error; 
    }
};