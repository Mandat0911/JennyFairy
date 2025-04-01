import jwt from "jsonwebtoken";

export const generateTokens = async (accountId, email, res) => {
    // Ensure ACCESS_TOKEN_SECRET is defined
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
    }
    const accessToken = jwt.sign({accountId, email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    })

    const refreshToken = jwt.sign({accountId, email}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, {
        maxAge: 24 * 60 * 60 * 1000, // 1 days in milliseconds
        httpOnly: true, // Prevent access to cookies via JavaScript
        sameSite: "none", // Prevent CSRF attacks
        domain: ".onrender.com", 
        secure: process.env.NODE_ENV === "production", // Secure only in production
    })

    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // Prevent access to cookies via JavaScript
        sameSite: "none", // Prevent CSRF attacks
        domain: ".onrender.com", 
        secure: process.env.NODE_ENV === "production", // Secure only in production
    })

    return {accessToken, refreshToken};
}
