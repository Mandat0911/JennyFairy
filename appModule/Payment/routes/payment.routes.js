import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { createCheckoutSession, checkoutSuccess } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute(["USER", "MANAGER", "ADMIN"]), createCheckoutSession);
router.post("/checkout-success", protectRoute(["USER", "MANAGER", "ADMIN"]), checkoutSuccess)



export default router;