import express from "express"
import {getAllOrder, deleteOrder, editOrder, cancelOrderUser} from "../controllers/order.controller.js"
import {protectRoute } from "../../utils/middleware/protectRoute.js";

const router = express.Router();

router.get("/",  protectRoute(["MANAGER","ADMIN"]),getAllOrder);
router.put("/edit-order/:id", protectRoute(["MANAGER","ADMIN"]), editOrder)
router.delete("/delete/:id", protectRoute(["MANAGER","ADMIN"]), deleteOrder);
router.put("/delete/:id", protectRoute(["USER","MANAGER","ADMIN"]), cancelOrderUser);

export default router;