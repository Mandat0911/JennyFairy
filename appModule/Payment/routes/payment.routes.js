import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";


const router = express.Router();


router.post("/create-checkout-session", protectRoute(["USER", "MANAGER", "ADMIN"]), createProduct);



export default router;