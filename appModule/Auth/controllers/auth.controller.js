import { forgotPasswordService, getMeService, loginService, logoutService, refreshTokenService, resendVerificationEmailService, resetPasswordService, signupService, verifyEmailService } from "../service/auth.service.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const response = await signupService(name, email, password, res);

        res.status(201).json(response); // Sending a single structured object
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await loginService(email, password, res);

        console.log(response);
        res.status(201).json(response);
    } catch (error) {
        console.error("Error in login controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body; // Ensure 'code' is coming from req.body
        const response = await verifyEmailService(code, res);
      // Send response
      res.status(200).json(response);
    } catch (error) {
        console.error("Error in verifyEmail controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const resendVerificationEmail = async (req, res) => {

    try {
        const { email } = req.body;
        const response = await resendVerificationEmailService(email, res);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in resendVerificationEmail controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const forgotPassword = async (req, res) => {
    
    try {
        const {email} = req.body;
        const response = await forgotPasswordService(email, res);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in forgotPassword controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const response = await resetPasswordService(token, password, res);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in resetPassword controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};
  
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const response = await logoutService(refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in logout controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const response = await refreshTokenService(refreshToken);
        // Send the new access token as a cookie
        res.cookie("accessToken", response.accessToken, {
            maxAge: 1 * 60 * 1000, // 15 minutes in milliseconds
            httpOnly: true, // Prevent access to cookies via JavaScript
            sameSite: "strict", // Prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Secure only in production
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in refreshToken controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const getMe = async (req, res) => {
    try {
        const response = await getMeService(req.user._id);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getMe controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};





