import { storeRefreshToken } from "../../../backend/lib/redis/redis.js";
import User from "../../User/models/user.models.js";
import { generateTokens } from "../../utils/generateToken.js";
import { generateVerificationToken } from "../../utils/generateVerificationCode.js";
import { hashPassword } from "../../utils/hashPass.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../../utils/mail/emailSetup.js";
import Account from "../models/account.models.js";
import { accountDTO, resendVerificationEmailDTO, tokenDTO, userDTO, verificationDTO } from "../dto/auth.dto.js";
import bcrypt from 'bcryptjs';

export const signupService = async({name, email, password}, res) => {
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
}

export const loginService = async({email, password}, res) => {

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
  return {
    user: userDTO(user),
    account: accountDTO(account),
    token: tokenDTO(accessToken, refreshToken),
    };

}

export const verifyEmailService = async(code, res) => {

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
}

export const resendVerificationEmailService = async(email, res) => {
    

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

}