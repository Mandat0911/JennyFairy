import express from "express"
import {getAllProduct, getFeaturedProduct, createProduct, deleteProduct} from "../../Product/controllers/product.controller.js"
import {protectRoute } from "../../utils/middleware/protectRoute.js";


const router = express.Router();

router.get("/", protectRoute(["USER", "MANAGER", "ADMIN"]), getAllProduct);
router.get("/featured", getFeaturedProduct);
router.post("/create-product", protectRoute(["MANAGER", "ADMIN"]), createProduct);
router.delete("/delete/:id", protectRoute(["MANAGER", "ADMIN"]), deleteProduct);


export default router;