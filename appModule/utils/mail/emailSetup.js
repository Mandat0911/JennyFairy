import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import {transporter} from "./email.Config.js";

export const sendVerificationEmail = async (userEmail, verificationToken) => {
    try {
      // Generate verification link
    //   const verificationLink = `https://yourdomain.com/verify-email?token=${verificationToken}`;
  
      // Replace placeholders in the email template
      const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{{verificationToken}}", verificationToken)
        // .replace("{{verificationLink}}", verificationLink);
  
      // Send email using the configured transporter
      const info = await transporter.sendMail({
        from: '"RMIT Charity" <nguyenmandat0744@gmail.com>',
        to: userEmail,
        subject: "Verify Your Email Address",
        text: `Use the following verification token to verify your email: ${verificationToken}`, // Plain text fallback
        html: htmlContent, // Rich HTML content
      });
  
      console.log("Verification email sent successfully!", info);
    } catch (error) {
      console.error("Error sending verification email:", error.message);
  
      // Throw an error to be handled by the calling function
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  };
  