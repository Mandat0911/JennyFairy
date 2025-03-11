import { forgotPasswordService, getMeService, loginService, logoutService, refreshTokenService, resendVerificationEmailService, resetPasswordService, signupService, verifyEmailService } from "../service/auth.service.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
    try { 
        const { user, account } = await signupService(req.body, res);
        res.status(201).json({ user, account });
    } catch (error) {
        console.error("Error in signup controller: ", error.message);
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { user, account } = await loginService(req.body, res);
        res.status(201).json({ user, account });
    } catch (error) {
      console.error("Error in login controller", error.message);
      return res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body; // Ensure 'code' is coming from req.body
    try {
        const response = await verifyEmailService(code, res);
      // Send response
      res.status(200).json(response);
    } catch (error) {
      console.error("Error in verifyEmail controller: ", error.message);
      res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body; // Ensure the email is provided in the request body
    try {
        const response = await resendVerificationEmailService(email, res);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in resendVerificationEmail controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const response = await forgotPasswordService(email, res);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in forgotPassword controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
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
        res.status(500).json({ error: "Internal Server Error!" });
    }
};
  
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const response = await logoutService(refreshToken, res);

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const response = await refreshTokenService(refreshToken);
        // Send the new access token as a cookie
        res.cookie("accessToken", response.accessToken, {
            maxAge: 60 * 60 * 1000, // 15 minutes in milliseconds
            httpOnly: true, // Prevent access to cookies via JavaScript
            sameSite: "strict", // Prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Secure only in production
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in refreshToken controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const getMe = async (req, res) => {
    try {
        const { user, account } = await getMeService(req.user._id);
        res.status(200).json({ user, account });
    } catch (error) {
        console.error("Error in getMe controller:", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};





