import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { createCheckoutSession, checkoutSuccess, createCheckoutQrcode } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute(["USER", "MANAGER", "ADMIN"]), createCheckoutSession);
router.post("/checkout-success", protectRoute(["USER", "MANAGER", "ADMIN"]), checkoutSuccess)

router.post("/create-checkout-qrcode", protectRoute(["USER", "MANAGER", "ADMIN"]), createCheckoutQrcode)


export default router;