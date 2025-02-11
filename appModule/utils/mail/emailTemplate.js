export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #5A2A27; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF5F7;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #FFC1CC, #FF85A2); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-family: 'Poppins', sans-serif;">Verify Your Email</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #FFFFFF; padding: 20px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="color: #5A2A27;">Hello, {{userName}}</p>
    <p style="color: #5A2A27;">Thank you for signing up! To complete your registration, please verify your email address using the verification token provided below:</p>
    
    <!-- Verification Token -->
    <div style="margin: 20px 0; background-color: #FFF0F3; padding: 15px; border: 1px solid #FF85A2; border-radius: 5px; text-align: center;">
      <h3 style="margin: 0; color: #FF5C8A; font-family: 'Poppins', sans-serif;">Your Verification Token</h3>
      <p style="font-size: 20px; font-weight: bold; margin: 10px 0; color: #5A2A27;">{{verificationToken}}</p>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{verificationLink}}" 
         style="text-decoration: none; background-color: #FF85A2; color: white; padding: 12px 24px; font-size: 16px; border-radius: 25px; font-family: 'Poppins', sans-serif; font-weight: bold;">
        Verify Your Email
      </a>
    </div>

    <p style="color: #5A2A27;">If you did not create this account, please ignore this email or contact our support team immediately.</p>

    <p style="color: #5A2A27;">Thank you for choosing our platform!</p>
    <p style="color: #5A2A27;"><strong>Best regards,</strong><br>JennyFairy</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p>&copy; 2024 Your App, Inc. All rights reserved.</p>
  </div>
</body>
</html>
`;



export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to JennyFairy</title>
</head>
<body style="font-family: 'Poppins', sans-serif; line-height: 1.6; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffafc;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #ffb6c1, #ff69b4); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to JennyFairy 💖</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #fff; padding: 20px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 16px;">Hey {{userName}},</p>
    <p style="font-size: 16px;">Your account is officially part of the JennyFairy fam! 🎉 Get ready to explore the trendiest fashion that fits your vibe.</p>
    <p>Here’s how you can get started:</p>

    <!-- Call to Action -->
    <div style="margin: 20px 0; background-color: #fffafc; padding: 15px; border: 1px solid #ffb6c1; border-radius: 10px;">
      <ul style="list-style: none; padding: 0; margin: 10px 0; font-size: 16px;">
        <li><strong>🛍 Shop New Drops:</strong> Check out the latest styles before they sell out.</li>
        <li><strong>💡 Style Inspo:</strong> Browse our lookbook for outfit ideas that slay.</li>
        <li><strong>🎁 Exclusive Perks:</strong> Enjoy special discounts and early access.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ShoppingLink}}" 
         style="text-decoration: none; background-color: #ff69b4; color: white; padding: 12px 24px; font-size: 16px; border-radius: 30px; font-weight: bold; display: inline-block;">
        Start Shopping 💕
      </a>
    </div>

    <p>If you ever need help, our team is just a click away! Slide into our DMs or email us anytime. 💌</p>
    <p>Catch you soon, fashion icon! ✨</p>
    <p>Love, <br>The JennyFairy Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This email is totally automated, so no need to reply. But we’d love to chat—hit us up on social! 📲</p>
    <p>&copy; 2024 JennyFairy. All rights reserved.</p>
  </div>
</body>
</html>
`;

export const RESET_PASSWORD_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'Poppins', sans-serif; line-height: 1.6; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffafc;">
  
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #FFB6C1, #FFC0CB); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: bold;">Reset Your Password</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 16px;">Hello {{userName}},</p>
    <p style="font-size: 16px;">We noticed you requested a password reset. Click the button below to refresh your access to JennyFairy:</p>

    <!-- Reset Link -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetLink}" 
         style="text-decoration: none; background-color: #FF69B4; color: white; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">If you didn’t request this, no worries! Just ignore this email.</p>

    <p style="font-size: 14px; color: #777;">Need help? Our <a href="#" style="color: #FF69B4; text-decoration: none; font-weight: bold;">support team</a> is always here for you.</p>

    <p style="font-size: 14px; font-weight: bold;">Stay stylish,<br>The JennyFairy Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
    <p>This is an automated message, please do not reply.</p>
    <p>&copy; 2024 JennyFairy. All rights reserved.</p>
  </div>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: 'Poppins', sans-serif; line-height: 1.6; color: #555; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff5f8;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #ff85a2, #ffbbcc); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Successfully</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 16px;">Hello {{userName}},</p>
    <p>Your password has been successfully reset. You can now log in and continue shopping for your favorite styles at JennyFairy!</p>

    <!-- Next Steps -->
    <div style="margin: 20px 0; background-color: #fff0f5; padding: 15px; border: 1px solid #ff85a2; border-radius: 5px;">
      <ul style="list-style: none; padding: 0; margin: 10px 0; font-size: 14px;">
        <li><strong>🛍 Discover New Arrivals:</strong> Check out the latest trends just for you.</li>
        <li><strong>🔒 Stay Secure:</strong> Consider updating your security settings for added protection.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{resetLink}}" 
         style="text-decoration: none; background-color: #ff85a2; color: white; padding: 12px 25px; font-size: 16px; border-radius: 6px; font-weight: bold; display: inline-block;">
        Log In Now
      </a>
    </div>

    <p>If you didn't request this change, please contact our support team immediately.</p>

    <p>See you soon at <strong>JennyFairy</strong>! ✨</p>
    <p>With love,<br>The JennyFairy Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply.</p>
    <p>&copy; 2024 JennyFairy. All rights reserved.</p>
  </div>
</body>
</html>
`;

