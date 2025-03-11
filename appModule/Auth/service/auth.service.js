import { redis, storeRefreshToken } from "../../../backend/lib/redis/redis.js";
import User from "../../User/models/user.models.js";
import { generateTokens } from "../../utils/generateToken.js";
import { generateVerificationToken } from "../../utils/generateVerificationCode.js";
import { hashPassword } from "../../utils/hashPass.js";
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../../utils/mail/emailSetup.js";
import Account from "../models/account.models.js";
import { accountDTO, forgotPasswordDTO, logoutDTO, refreshTokenDTO, resendVerificationEmailDTO, resetPasswordDTO, tokenDTO, userDTO, verificationDTO } from "../dto/auth.dto.js";
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import dotenv from "dotenv";
import  jwt  from "jsonwebtoken";

dotenv.config();

export const signupService = async({name, email, password}, res) => {
    try {
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
    
        const { accessToken, refreshToken } = await generateTokens(newAccount._id, email, res);
        await storeRefreshToken(newAccount._id, refreshToken);
    
        return {
            user: userDTO(newUser),
            account: accountDTO(newAccount),
            token: tokenDTO(accessToken, refreshToken),
        };
    } catch (error) {
        console.error("Error in signupService: ", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
}

export const loginService = async({email, password}, res) => {
    try {
        // Find account by email
    const account = await Account.findOne({ email });
  
    // Check if account exists
    if (!account){
        throw new Error("Invalid email or password!");  
      } 

    // Check if the account is verified
    if (!account.isVerified) {
        throw new Error("Your account is not verified. Please check your email.");
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect){
        throw new Error("Invalid email or password!");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(account._id, account.email, res);
    
    // Store refresh token
    await storeRefreshToken(account._id, refreshToken);

    // Find the associated user
    const user = await User.findOne({ accountId: account._id });
    if (!user) {    
        throw new Error("User not found!");
    }

    await Account.updateOne(
      {_id: account._id},
      {
          $set: {
              lastLogin: new Date(),
          }
      }
  )
    return {
    user: userDTO(user),
    account: accountDTO(account),
    token: tokenDTO(accessToken, refreshToken)};
    } catch (error) {
        console.error("Error in loginService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
        
    }
}

export const verifyEmailService = async(code, res) => {
    try {
        // Find the account with the matching verificationToken
    const account = await Account.findOne({
        verificationToken: code,
        verificationTokenExpireAt: { $gt: Date.now()}, // Use Date.now() correctly
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
    return verificationDTO("Email verified successfully!");
    } catch (error) {
        console.error("Error in verifyEmailService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
        
    }
}

export const resendVerificationEmailService = async(email, res) => {
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

    return resendVerificationEmailDTO("Verification email sent successfully!")
    } catch (error) {
        console.error("Error in resendVerificationEmailService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
        
    }

}

export const forgotPasswordService = async(email, res) => {
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

         return forgotPasswordDTO("Password reset link sent to your email!")
    } catch (error) {
        console.error("Error in forgotPasswordService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const resetPasswordService = async(token, password, res) => {
    try {
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
        
        return resetPasswordDTO("Password reset successful")
    } catch (error) {
        console.error("Error in resetPasswordService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const logoutService = async(refreshToken, res) => {
    try {
        if (!refreshToken) {
            return { success: false, message: "No refresh token provided!" };
        };
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token: ${decoded.accountId}`);
        } catch (error) {
            console.warn("Invalid or expired refresh token:", error.message);
        }
        return logoutDTO("Logout successful!");
    } catch (error) {
        console.error("Error in logoutService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const refreshTokenService = async(refreshToken, res) => {
    try {
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
            { expiresIn: "60m" }
        );

        return refreshTokenDTO(newAccessToken, "Access token refreshed!");

    } catch (error) {
        console.error("Error in refreshTokenService: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export const getMeService = async(userId, res) => {
    try {
        if (!userId) {
            throw new Error("Unauthorized access!");
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found!");
        }
        await user.populate("accountId", "-password");

        return {
            user: userDTO(user),
            account: accountDTO(user.accountId),
        }
    } catch (error) {
        console.error("Error in getMeService:", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
}