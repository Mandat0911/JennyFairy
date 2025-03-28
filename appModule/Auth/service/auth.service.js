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
import Order from "../../Order/model/order.model.js";
import Payment from "../../Payment/model/payment.models.js";
import Coupon from "../../Coupons/model/coupon.models.js";

dotenv.config();

export const signupService = async(name, email, password, res) => {
    try {
        if (!name || !email || !password) { throw { status: 400, message: "All fields are required!" };}

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) { throw { status: 400, message: "Invalid email format!" };}
        const existingEmail = await Account.findOne({ email });
        if (existingEmail) { throw { status: 400, message: "Email is already taken!!" };}
    
        if (password.length < 6) { throw { status: 400, message: "Password must be at least 6 characters!" };}
    
        const hashedPassword = await hashPassword(password);
        const verificationToken = generateVerificationToken(6);
    
        const newAccount = new Account({ email, password: hashedPassword, verificationToken, verificationTokenExpireAt: new Date(Date.now() + 24 * 60 * 60 * 1000), userType: "USER" });
        await newAccount.save();
        
        const newUser = new User({ name, email, accountId: newAccount._id });
        await newUser.save();
        await sendVerificationEmail(email, newUser.name ,verificationToken);
    
        const { accessToken, refreshToken } = await generateTokens(newAccount._id, email, res);
        await storeRefreshToken(newAccount._id, refreshToken);
    
        return { user: userDTO(newUser), account: accountDTO(newAccount), token: tokenDTO(accessToken, refreshToken) };
    } catch (error) {
        console.error("Error in signupService: ", error.message);
        throw error;
    }
}

export const loginService = async (email, password, res) => {
    try {
        const account = await Account.findOne({ email });
        if (!account) { throw { status: 400, message: "Invalid email or password!" };}
        if (!account.isVerified) { throw { status: 403, message: "Your account is not verified. Please check your email." };}

        const isPasswordCorrect = await bcrypt.compare(password, account.password);
        if (!isPasswordCorrect) { throw { status: 400, message: "Invalid email or password!" };}

        const { accessToken, refreshToken } = await generateTokens(account._id, account.email, res);
        await storeRefreshToken(account._id, refreshToken);

        const user = await User.findOne({ accountId: account._id });
        if (!user) { throw { status: 404, message: "User not found!" }; }

        await Account.updateOne({ _id: account._id }, { $set: { lastLogin: new Date() }});

        return {  user: userDTO(user), account: accountDTO(account),token: tokenDTO(accessToken, refreshToken) };
    } catch (error) {
        console.error("Error in loginService:", error.message);
        throw error; 
    }
};


export const verifyEmailService = async(code, res) => {
    try {
    const account = await Account.findOne({verificationToken: code, verificationTokenExpireAt: { $gt: Date.now()}});
        if (!account) { throw { status: 400, message: "Invalid or expired verification code!" } }
        if (account.isVerified) { throw { status: 400, message: "Your account is already verified." }}
  
    const user = await User.findOne({ accountId: account._id });
  
    if (!user) { throw { status: 404, message: "User not found!" } }
  
    await Account.updateOne( {_id: account._id}, { $set: { isVerified: true, }, $unset:{ verificationToken:"", verificationTokenExpireAt:""}})
  
    await sendWelcomeEmail(account.email, user.name);
    return verificationDTO("Email verified successfully!");
    } catch (error) {
        console.error("Error in verifyEmailService: ", error.message);
        throw error;        
    }
}

export const resendVerificationEmailService = async(email, res) => {
    try {
    const account = await Account.findOne({ email });

    if (!account) {throw { status: 404, message: "Account not found!" }}
    if (account.isVerified) {throw { status: 400, message: "Your account is already verified." } }

    const verificationToken = generateVerificationToken(6);
    const verificationTokenExpireAt = Date.now() + 600000; 

    await Account.updateOne({ _id: account._id }, { $set: { verificationToken: verificationToken, verificationTokenExpireAt: verificationTokenExpireAt }});

    const user = await User.findOne({ accountId: account._id });

    if (!user) {throw { status: 404, message: "User not found!" }}

    await sendVerificationEmail(account.email, user.name, verificationToken);
    return resendVerificationEmailDTO("Verification email sent successfully!")
    } catch (error) {
        console.error("Error in resendVerificationEmailService: ", error.message);
        throw error;                
    }
}

export const forgotPasswordService = async(email, res) => {
    try {
        const account = await Account.findOne({email});
        if(!account){throw { status: 400, message: "Account not found!" }}

        const user = await User.findOne({ accountId: account._id })

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 3600000; 

        await Account.updateOne({_id: account._id}, {$set: {resetPasswordToken: resetToken, resetPasswordExpireAt: resetTokenExpiresAt}})
        
        await sendResetPasswordEmail(account.email, user.name, resetToken);
         return forgotPasswordDTO("Password reset link sent to your email!")
    } catch (error) {
        console.error("Error in forgotPasswordService: ", error.message);
        throw error;                
    }
}

export const resetPasswordService = async(token, password, res) => {
    try {
        const account = await Account.findOne({resetPasswordToken: token, resetPasswordExpireAt: {$gt: Date.now()}});
        if(!account){ throw { status: 400, message: "Invalid or expired verification code!" }}
    
        const user = await User.findOne({accountId: account._id});
        if (!user) { throw { status: 400, message: "User not found!" }}
        
        //update new hash password
        const hashedPassword = await hashPassword(password);
        await Account.updateOne({_id: account._id}, {$set: {password: hashedPassword, }, $unset:{resetPasswordToken:"", resetPasswordExpireAt:""}})
        
        await sendResetPasswordSuccessEmail(account.email, user.name);
        return resetPasswordDTO("Password reset successful")
    } catch (error) {
        console.error("Error in resetPasswordService: ", error.message);
        throw error;                
    }
}

export const logoutService = async(refreshToken) => {
    try {
        if (!refreshToken) {throw { status: 400, message: "No refresh token provided!" }}
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.accountId}`);
        } catch (error) {
            console.warn("Invalid or expired refresh token:", error.message);
        }
        return logoutDTO("Logout successful!");
    } catch (error) {
        console.error("Error in logoutService: ", error.message);
        throw error;                
    }
}

export const refreshTokenService = async(refreshToken) => {
    try {
        let decoded;
        if (!refreshToken) {throw { status: 403, message: "Refresh token is required!" }}
        
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {throw { status: 403, message: "Invalid or expired refresh token!" }}

        const storedToken = await redis.get(`refresh_token: ${decoded.accountId}`);
        if (storedToken !== refreshToken) {throw { status: 403, message: "Invalid refresh token!" }}

        const newAccessToken = jwt.sign( { accountId: decoded.accountId, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

        return refreshTokenDTO(newAccessToken, "Access token refreshed!");
    } catch (error) {
        console.error("Error in refreshTokenService: ", error.message);
        throw error;                
    }
}

export const getUserProfileService = async(userId) => {
    try {
        const user = await User.findById(userId).select("name email");
        if (!user) { throw { status: 404, message: "User not found!" }}
        
        const orders = await Order.find({user: userId}).sort({createdAt: -1}).populate("products.product", "-_id name img createdAt");

        return {user: { name: user.name, email: user.email }, orders: orders.map((order) => ({ id: order._id, createdAt: order.createdAt, products: order.products || [], totalAmount: order.totalAmount || null, shippingDetails: order.shippingDetails || {}}))};
    } catch (error) {
        console.error("Error in getUserProfileService:", error.message);
        throw error;                
    }
}

export const deleteAccountService = async(userId, res) => {
    try {
        const user = await User.findById(userId).select("accountId");
        if (!user) {throw { status: 404, message: "User not found!" }}
        await Promise.all([ Payment.deleteMany({user: userId}), Order.deleteMany({user: userId}), Coupon.updateMany({usedBy: userId}, {$pull: {usedBy: userId}}), user.accountId ? Account.findByIdAndDelete(user.accountId) : null])
    
        await User.findByIdAndDelete(userId);
    
        return {message: "Account delete successful!"};
    } catch (error) {
        console.error("Error in deleteAccountService:", error.message);
        throw error;                
    }
}

export const getMeService = async(userId, res) => {
    try {
        if (!userId) {throw { status: 401, message: "Unauthorized access!" }}
        const user = await User.findById(userId).select("-password");
        if (!user) {throw { status: 404, message: "User not found!" }}
        await user.populate("accountId", "-password");

        return {user: userDTO(user), account: accountDTO(user.accountId)}
    } catch (error) {
        console.error("Error in getMeService:", error.message);
        throw error;                
    }
}