import { hashPassword } from "../../utils/hashPass.js";
import User from "../../User/models/user.models.js";
import Account from "../models/account.models.js";
import {generateTokens} from "../../utils/generateToken.js"
import { redis, storeRefreshToken } from "../../../backend/lib/redis/redis.js";
import  jwt  from "jsonwebtoken";
import { generateVerificationToken } from "../../utils/generateVerificationCode.js";
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../../utils/mail/emailSetup.js";
import dotenv from "dotenv";

dotenv.config();

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
        const verificationToken = generateVerificationToken(6);

  
        const newAccount = new Account({
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpireAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 6hrs
            userType: "USER",
        });
        await newAccount.save();
        

        const newUser = new User({
            name: name,
            email: email,
            accountId: newAccount._id,
        });
        await newUser.save();
        await sendVerificationEmail(email, newUser.name ,verificationToken);
        // authenticate user
        const{accessToken, refreshToken} = await generateTokens(newAccount._id, email, res)
        await storeRefreshToken(newAccount._id, refreshToken);

        res.status(201).json({
            ...newUser._doc,
            verificationToken: newAccount.verificationToken,
            isVerified: newAccount.isVerified,
            verificationTokenExpireAt: newAccount.verificationTokenExpireAt,
            lastLogin: newAccount.lastLogin,
            userType: newAccount.userType,
            password: undefined,
        })

    } catch (error) {
        console.error("Error in signup controller: ", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find account by email
      const account = await Account.findOne({ email });
  
      // Check if account exists
      if (!account) return res.status(400).json({ error: "Invalid email or password!" });
  
      // Check if the account is verified
      if (!account.isVerified) {
        return res.status(400).json({
          error: "Your account is not verified. Please check your email to verify your account."
        });
      }
  
      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(password, account.password);
      if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid email or password!" });
  
      // Generate tokens
      const { accessToken, refreshToken } = await generateTokens(account._id, account.email, res);
      
      // Store refresh token
      await storeRefreshToken(account._id, refreshToken);
  
      // Find the associated user
      const user = await User.findOne({ accountId: account._id });
      if (!user) return res.status(404).json({ error: "User not found!" });

      await Account.updateOne(
        {_id: account._id},
        {
            $set: {
                lastLogin: new Date(),
            }
        }
    )
      // Send response
      res.status(200).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        account: {
            _id: account._id,
            email: account.email,
            isVerified: account.isVerified,
            verificationToken: account.verificationToken,
            verificationTokenExpireAt: account.verificationTokenExpireAt,
            lastLogin: account.lastLogin,
            userType: account.userType,
        }
        
      });
    } catch (error) {
      console.error("Error in login controller", error.message);
      return res.status(500).json({ error: "Internal Server Error!" });
    }
};
  

export const verifyEmail = async (req, res) => {
    const { code } = req.body; // Ensure 'code' is coming from req.body
  
    try {
      // Find the account with the matching verificationToken
      const account = await Account.findOne({
        verificationToken: code,
        verificationTokenExpireAt: { $gt: Date.now() }, // Use Date.now() correctly
      });
  
      // If no matching account is found
      if (!account) {
        return res.status(400).json({ success: false, message: "Invalid or expired verification code!" });
      }
  
      // Check if the account is already verified
      if (account.isVerified) {
        return res.status(400).json({ success: false, message: "Your account is already verified." });
      }
  
      // Find the associated user by accountId
      const user = await User.findOne({ accountId: account._id }); // Match User based on accountId
  
      // If user is not found
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
      }
  
      await Account.updateOne(
        {_id: account._id},
        {
            $set: {
                isVerified: true,
            },
            $unset:{
                verificationToken:"",
                verificationTokenExpireAt:"",
            }
        }
    )
  
      // Send the welcome email
      await sendWelcomeEmail(account.email, user.name);
  
      // Send response
      res.status(200).json({ success: true, message: "Email verified successfully!" });
    } catch (error) {
      console.error("Error in verifyEmail controller: ", error.message);
      res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body; // Ensure the email is provided in the request body

    try {
        // Find the account by email
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(404).json({ success: false, message: "Account not found!" });
        }

        // Check if the account is already verified
        if (account.isVerified) {
            return res.status(400).json({ success: false, message: "Your account is already verified." });
        }

        // Generate a new verification token and expiration time
        const verificationToken = generateVerificationToken(6);
        const verificationTokenExpireAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

        // Update account with the new verification token
        await Account.updateOne(
            { _id: account._id },
            {
                $set: {
                    verificationToken: verificationToken,
                    verificationTokenExpireAt: verificationTokenExpireAt,
                }
            }
        );

        // Find the associated user
        const user = await User.findOne({ accountId: account._id });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Send the verification email
        await sendVerificationEmail(account.email, user.name, verificationToken);

        res.status(200).json({ success: true, message: "Verification email sent successfully!" });
    } catch (error) {
        console.error("Error in resendVerificationEmail controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};


export const forgotPassword = async (req, res) => {

    const {email} = req.body;

    try {
        const account = await Account.findOne({email});

        if(!account){
            return res.status(400).json({success: false, message: "Account not found!"});
        }
        const user = await User.findOne({ accountId: account._id }); // Match User based on accountId

        // Using Crypto to generate short-lived token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour lived

        await Account.updateOne(
            {_id: account._id},
            {
                $set: {
                    resetPasswordToken: resetToken,
                    resetPasswordExpireAt: resetTokenExpiresAt,
                },
            }
        )
        await sendResetPasswordEmail(account.email, user.name, resetToken);

        res.status(200).json({success: true, message:"Password reset link sent to your email!"});

    } catch (error) {
        console.error("Error in forgotPassword controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const account = await Account.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: {$gt: Date.now()},
        });

        if(!account){
            return res.status(400).json({ success: false, message: "Invalid or expired verification code!" });
        }

        const user = await User.findOne({accountId: account._id});
          // If user is not found
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
        
        //update new hash password
        const hashedPassword = await hashPassword(password);
        await Account.updateOne(
            {_id: account._id},
            {
                $set: {
                    password: hashedPassword,
                },
                $unset:{
                    resetPasswordToken:"",
                    resetPasswordExpireAt:"",
                }
            }
        )
          
        await sendResetPasswordSuccessEmail(account.email, user.name);

        res.status(200).json({success: true, message:"Password reset successful"});
    } catch (error) {
        console.error("Error in resetPassword controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
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

export const getMe = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Unauthorized access!" });
        }

        // Fetch user excluding password
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Populate the accountId field
        await user.populate("accountId", "-password");

        return res.json({ user, account: user.accountId }); // Access directly from populated data
    } catch (error) {
        console.error("Error in getMe controller:", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};





