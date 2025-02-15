import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { addToCart, removeCartItem, removeAllItem, updateQuantity, getCartProducts } from "../controllers/cart.controller.js";


const router = express.Router();
router.get("/", protectRoute(["USER","MANAGER", "ADMIN"]), getCartProducts)
router.post("/addItem", protectRoute(["USER","MANAGER", "ADMIN"]), addToCart);
router.post("/removeItem", protectRoute(["USER","MANAGER", "ADMIN"]), removeCartItem);
router.post("/removeAllItem", protectRoute(["USER","MANAGER", "ADMIN"]), removeAllItem);
router.patch("/update-quantity/:id", protectRoute(["USER","MANAGER", "ADMIN"]), updateQuantity);


export default router;