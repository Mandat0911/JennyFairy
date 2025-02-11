import express from "express"
import {signup, login, logout, refreshToken, verifyEmail, forgotPassword, resetPassword, getMe, resendVerificationEmail} from "../../Auth/controllers/auth.controller.js"
import { protectRoute } from "../../utils/middleware/protectRoute.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/verify-email", verifyEmail);

router.post("/refresh-token", refreshToken);

router.post("/resend-verification", resendVerificationEmail);

router.get("/me", protectRoute(["USER", "MANAGER", "ADMIN"]), getMe);

export default router;