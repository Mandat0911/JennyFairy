import express from "express"
import {getAllProduct, getFeaturedProduct, createProduct, deleteProduct, getRecommendedProduct, getProductsByCategory, toggleFeaturedProduct} from "../../Product/controllers/product.controller.js"
import {protectRoute } from "../../utils/middleware/protectRoute.js";


const router = express.Router();

router.get("/", protectRoute(["USER", "MANAGER", "ADMIN"]), getAllProduct);
router.get("/featured", getFeaturedProduct);
router.get("recommended", getRecommendedProduct);
router.get("/category/:category", getProductsByCategory);
router.post("/create-product", 
    // protectRoute(["MANAGER", "ADMIN"]), 
    createProduct);
router.patch("/:id/", protectRoute(["MANAGER", "ADMIN"]), toggleFeaturedProduct);
router.delete("/delete/:id", protectRoute(["MANAGER", "ADMIN"]), deleteProduct);


export default router;