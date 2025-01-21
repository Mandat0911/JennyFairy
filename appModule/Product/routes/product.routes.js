import express from "express"
import {getAllProduct} from "../../Product/controllers/product.controller.js"


const router = express.Router();

router.get("/", getAllProduct);


export default router;