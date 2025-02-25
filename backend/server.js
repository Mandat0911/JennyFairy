import express from "express"
import dotenv from "dotenv";
import connectMongoDB from "./lib/db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "../appModule/Auth/routes/auth.routes.js"
import productRoute from "../appModule/Product/routes/product.routes.js"
import cartRoute from "../appModule/cart/routes/cart.routes.js"
import cartCoupons from "../appModule/Coupons/routes/coupon.routes.js"
import paymentRoute from "../appModule/Payment/routes/payment.routes.js"
import analyticRoute from "../appModule/Analytics/routes/analytic.routes.js"
import collectionRoute from "../appModule/Collections/routes/collections.routes.js"



const app = express();

dotenv.config();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" })); // This middleware parses req.body for JSON data
app.use(express.urlencoded({ extended: true })); // This parses application/x-www-form-urlencoded data
app.use(cookieParser());


// API auth
app.use("/api/auth/", authRoute);
app.use("/api/product/", productRoute);
app.use("/api/collection/", collectionRoute);
app.use("/api/cart/", cartRoute);
app.use("/api/coupons/", cartCoupons);
app.use("/api/payment/", paymentRoute)
app.use("/api/analytic/", analyticRoute)


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log("Database connected successfully!");
  console.log(`Server started at http://localhost:${PORT}`);
  connectMongoDB(); // Ensure MongoDB connection is established
});