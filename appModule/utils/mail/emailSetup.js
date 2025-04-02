import { PASSWORD_RESET_SUCCESS_EMAIL_TEMPLATE, RESET_PASSWORD_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, ORDER_CONFIRMATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import {transporter} from "./email.Config.js";

import dotenv from "dotenv";
import Order from "../../Order/model/order.model.js";


dotenv.config();

export const sendVerificationEmail = async (userEmail, userName , verificationToken) => {
    try {
      // Generate verification link
      const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{{verificationToken}}", verificationToken)
                                                     .replace("{{userName}}", userName)
                                                     .replace("{{verificationLink}}", `${process.env.CLIENT_URL}/verify-email`)
      // Send email using the configured transporter
      const info = await transporter.sendMail({
        from: '"JennyFairy Feminine" <jennyfairyfeminine@gmail.com>',
        to: userEmail,
        subject: "Verify Your Email Address",
        text: `Use the following verification token to verify your email: ${verificationToken}`, // Plain text fallback
        html: htmlContent, // Rich HTML content
      });
    } catch (error) {
      console.error("Error sending verification email:", error.message);
      // Throw an error to be handled by the calling function
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  const emailContent = WELCOME_EMAIL_TEMPLATE.replace("{{userName}}", userName)
                                             .replace("{{ShoppingLink}}", `${process.env.CLIENT_URL}`)
  try {
    const info = await transporter.sendMail({
      from: '"JennyFairy Feminine" <jennyfairyfeminine@gmail.com>',
      to: userEmail,
      subject: "Welcome to Our Platform!",
      html: emailContent,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw new Error("Failed to send welcome email.");
  }
};


export const sendResetPasswordEmail = async (userEmail, userName, resetToken) => {
  const emailContent = RESET_PASSWORD_EMAIL_TEMPLATE.replace("{{userName}}", userName)
                                                            .replace("{resetLink}", `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
  try {
    const info = await transporter.sendMail({
      from: '"JennyFairy Feminine" <jennyfairyfeminine@gmail.com>',
      to: userEmail,
      subject: "Password Reset",
      html: emailContent,
    });
  } catch (error) {
    console.error("Error sending password reset success email:", error.message);
    throw new Error("Failed to send password reset success email.");
  }
};

export const sendResetPasswordSuccessEmail = async (userEmail, userName) => {
  const emailContent = PASSWORD_RESET_SUCCESS_EMAIL_TEMPLATE.replace("{{userName}}", userName)
                                                            .replace("{{resetLink}}", `${process.env.CLIENT_URL}/login`);
  try {
    const info = await transporter.sendMail({
      from: '"Jenny Fairy" <nguyenmandat0744@gmail.com>',
      to: userEmail,
      subject: "Password Reset Successful",
      html: emailContent,
    });
    console.log("Password reset successful email sent successfully!", info);
  } catch (error) {
    console.error("Error sending password reset success email:", error.message);
    throw new Error("Failed to send password reset success email.");
  }
};

export const sendOrderDetailSuccessEmail = async (userEmail, username, order) => {
  const populatedOrder = await Order.findById(order._id).populate("products.product");
  const formattedTotalAmount = populatedOrder.totalAmount.toLocaleString('en-US');

  const orderItems = populatedOrder.products
  .map((p) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">
        <img src="${p.product?.img[0]|| null}" 
             alt="${p.product?.name || 'Product Image'}" 
             style="width: 50px; height: 50px; border-radius: 5px; margin-right: 10px;">
        ${p.product?.name || "Product Not Found"}
      </td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${p.size || "-"}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${p.quantity}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${p.price.toLocaleString('en-US')} VND</td>
    </tr>
  `)
  .join("");
  
  const emailContent = ORDER_CONFIRMATION_EMAIL_TEMPLATE
    .replace("{{userName}}", username)
    .replace("{{orderId}}", populatedOrder._id)
    .replace("{{orderId}}", populatedOrder._id)    
    .replace("{{orderDate}}", new Date(populatedOrder.createdAt).toLocaleDateString())
    .replace("{{totalAmount}}", formattedTotalAmount)
    .replace("{{orderItems}}", orderItems)
    .replace("{{fullName}}", populatedOrder.shippingDetails.fullName)
    .replace("{{phone}}", populatedOrder.shippingDetails.phone)
    .replace("{{address}}", populatedOrder.shippingDetails.address)
    .replace("{{city}}", populatedOrder.shippingDetails.city || "")
    .replace("{{postalCode}}", populatedOrder.shippingDetails.postalCode || "")
    .replace("{{country}}", populatedOrder.shippingDetails.country || "")
    .replace("{{trackingLink}}", `${process.env.CLIENT_URL}/orders/${populatedOrder._id}`);

  try {
    const info = await transporter.sendMail({
      from: '"JennyFairy Feminine" <jennyfairyfeminine@gmail.com>',
      to: userEmail,
      subject: "Your Order Confirmation",
      html: emailContent,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error.message);
    throw new Error("Failed to send order confirmation email.");
  }
};



  