import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { addToCart, removeCartItem, removeAllItem } from "../controllers/cart.controller.js";


const router = express.Router();

router.post("/addItem", protectRoute(["USER","MANAGER", "ADMIN"]), addToCart);
router.post("/removeItem", protectRoute(["USER","MANAGER", "ADMIN"]), removeCartItem);
router.post("/removeAllItem", protectRoute(["USER","MANAGER", "ADMIN"]), removeAllItem);



export default router;