import { deleteAccountService, forgotPasswordService, getMeService, getUserProfileService, loginService, logoutService, refreshTokenService, resendVerificationEmailService, resetPasswordService, signupService, verifyEmailService } from "../service/auth.service.js";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        res.status(201).json(await signupService(name, email, password, res));
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        res.status(201).json(await loginService(email, password, res));
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        res.status(200).json(await verifyEmailService(code, res));
    } catch (error) {
        console.error("Error in verifyEmail controller:", error.message);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};
;

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        res.status(200).json(await resendVerificationEmailService(email, res));
    } catch (error) {
        console.error("Error in resendVerificationEmail controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        res.status(200).json(await forgotPasswordService(email, res));
    } catch (error) {
        console.error("Error in forgotPassword controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;
        res.status(200).json(await resetPasswordService(token, password, res));
    } catch (error) {
        console.error("Error in resetPassword controller: ", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};
  
export const logout = async (req, res) => {
    try {
        const response = await logoutService(req.cookies.refreshToken);
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",       // Ensure HTTPS only
            sameSite: "lax",   // Important for cross-origin requests
            domain: ".onrender.com",  // Ensure it matches frontend
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: ".onrender.com",
            path: "/",
        });

        return res.status(200).json(response)
 
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const response = await refreshTokenService(refreshToken);
        res.cookie("accessToken", response.accessToken, {
            maxAge: 86400000, httpOnly: true, sameSite: "lax",  domain: ".onrender.com", secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in refreshToken controller:", error.message);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        res.status(200).json(await getUserProfileService(req.user._id));
    } catch (error) {
        console.error("Error in getUserProfile controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        res.status(200).json(await deleteAccountService(req.user._id));
    } catch (error) {
        console.error("Error in deleteAccount controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};

export const getMe = async (req, res) => {
    try {
        res.status(200).json(await getMeService(req.user._id));
    } catch (error) {
        console.error("Error in getMe controller:", error.message);
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error!" });
    }
};





