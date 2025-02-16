import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute(["USER", "MANAGER", "ADMIN"]), createCheckoutSession);



export default router;