import { hashPassword } from "../../utils/hashPass.js";
import User from "../../User/models/user.models.js";
import Account from "../models/account.models.js";
import {generateTokens} from "../../utils/generateToken.js"
import { redis, storeRefreshToken } from "../../../backend/lib/redis/redis.js";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs';


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format!" });
        }

        const existingEmail = await Account.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters!" });
        }

        const hashedPassword = await hashPassword(password);

        const newAccount = new Account({
            email,
            password: hashedPassword,
            userType: "USER",
        });
        await newAccount.save();

        const newUser = new User({
            name: name,
            email: email,
            accountId: newAccount._id,
        });
        await newUser.save();

        // authenticate user
        const{accessToken, refreshToken} = await generateTokens(newAccount._id, email, res)
        await storeRefreshToken(newAccount._id, refreshToken);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            userType: newAccount.userType
        })

    } catch (error) {
        console.error("Error in signup controller: ", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const account = await Account.findOne({ email });
      
      if (!account) return res.status(400).json({ error: "Invalid email or password!" });
  
      const isPasswordCorrect = await bcrypt.compare(password, account.password);
      if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid email or password!" });
  
      const{accessToken, refreshToken} = await generateTokens(account._id, account.email, res)
        await storeRefreshToken(account._id, refreshToken);
  
      const user = await User.findOne({ accountId: account._id })
      if (!user) return res.status(404).json({ error: "User not found!" });
  
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: account.userType,
      });
    } catch (error) {
      console.error("Error in login controller", error.message);
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  };

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                await redis.del(`refresh_token: ${decoded.accountId}`);
            } catch (error) {
                console.warn("Invalid or expired refresh token:", error.message);
            }
        }

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({ message: "Logged Out!" });
    } catch (error) {
        console.error("Error in logout controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Ensure the refresh token exists
        if (!refreshToken) {
            return res.status(403).json({ error: "Refresh token is required!" });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(403).json({ error: "Invalid or expired refresh token!" });
        }

        // Check if the refresh token exists in Redis
        const storedToken = await redis.get(`refresh_token: ${decoded.accountId}`);
        if (storedToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token!" });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { accountId: decoded.accountId, email: decoded.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // Send the new access token as a cookie
        res.cookie("accessToken", newAccessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
            httpOnly: true, // Prevent access to cookies via JavaScript
            sameSite: "strict", // Prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Secure only in production
        });

        res.status(200).json({ message: "Access token refreshed!" });
    } catch (error) {
        console.error("Error in refreshToken controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

