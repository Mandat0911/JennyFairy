import express from "express"
import {protectRoute } from "../../utils/middleware/protectRoute.js";
import { viewAnalyticsData } from "../controller/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute(["MANAGER", "ADMIN"]), viewAnalyticsData)



export default router;