import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { createCollection, deleteCollection, editCollection, getAllCollection, getCollectionDetail } from "../controllers/collections.controller.js";


const router = express.Router();

router.get("/", getAllCollection);
router.get("/:id", getCollectionDetail)
router.post("/create-collections", protectRoute(["MANAGER", "ADMIN"]), createCollection);
router.put("/edit-collection/:id", protectRoute(["MANAGER", "ADMIN"]), editCollection)
router.delete("/delete/:id", protectRoute(["MANAGER", "ADMIN"]), deleteCollection);

export default router;