import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import {createCoupon, getCoupon, validateCoupon, deleteCoupon, appliedCoupon} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute(["USER","MANAGER","ADMIN"]), getCoupon);
router.post("/create", protectRoute(["MANAGER","ADMIN"]), createCoupon);
router.post("/validate", protectRoute(["USER","MANAGER","ADMIN"]), validateCoupon);
router.post("/appliedCoupon", protectRoute(["USER","MANAGER","ADMIN"]), appliedCoupon);
router.delete("/delete/:id", protectRoute(["MANAGER","ADMIN"]), deleteCoupon)

export default router;