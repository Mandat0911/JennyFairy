export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #4CAF50, #087F23); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! To complete your registration, please verify your email address using the verification token provided below:</p>
    
    <!-- Verification Token -->
    <div style="margin: 20px 0; background-color: #ffffff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">
      <h3 style="margin: 0; color: #087F23;">Your Verification Token</h3>
      <p style="font-size: 20px; font-weight: bold; margin: 10px 0; color: #333;">{{verificationToken}}</p>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{verificationLink}}" 
         style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;">
        Verify Your Email
      </a>
    </div>

    <p>If you did not create this account, please ignore this email or contact our support team immediately.</p>

    <p>Thank you for choosing our platform!</p>
    <p>Best regards,<br>Your App Team</p>
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
  <title>Welcome to Our Platform</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #4CAF50, #087F23); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to [Your Platform Name]</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {{userName}},</p>
    <p>Congratulations! Your email has been successfully verified, and your account is now active.</p>
    <p>We’re excited to have you on board! Here’s what you can do next:</p>

    <!-- Call to Action -->
    <div style="margin: 20px 0; background-color: #ffffff; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
      <ul style="list-style: none; padding: 0; margin: 10px 0;">
        <li><strong>💻 Explore Features:</strong> Start using all the tools and features available on our platform.</li>
        <li><strong>📚 Learn More:</strong> Visit our knowledge base for tips and guides to help you get started.</li>
        <li><strong>🤝 Connect:</strong> Join our community and interact with other users.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://yourdomain.com/dashboard" 
         style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;">
        Go to Dashboard
      </a>
    </div>

    <p>If you have any questions or need assistance, feel free to reach out to our support team. We’re here to help!</p>

    <p>Welcome aboard, and thank you for choosing us!</p>
    <p>Best regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p>&copy; 2024 Your App, Inc. All rights reserved.</p>
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #FF5722, #D32F2F); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reset Your Password</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {{userName}},</p>
    <p>We received a request to reset your password. Please click the button below to reset it:</p>

    <!-- Reset Link -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetLink}" 
         style="text-decoration: none; background-color: #FF5722; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;">
        Reset Your Password
      </a>
    </div>

    <p>If you didn’t request a password reset, please ignore this email. Your password will not be changed.</p>

    <p>For any issues, please contact our support team.</p>

    <p>Best regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p>&copy; 2024 Your App, Inc. All rights reserved.</p>
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header Section -->
  <div style="background: linear-gradient(to right, #4CAF50, #087F23); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Your Password Has Been Reset</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {{userName}},</p>
    <p>We wanted to let you know that your password has been successfully reset. You can now use your new password to log in to your account.</p>

    <!-- Next Steps -->
    <div style="margin: 20px 0; background-color: #ffffff; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
      <ul style="list-style: none; padding: 0; margin: 10px 0;">
        <li><strong>🔑 Secure Your Account:</strong> Consider enabling two-factor authentication for extra security.</li>
        <li><strong>💻 Login:</strong> You can now log in with your new password to access your account.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://yourdomain.com/login" 
         style="text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;">
        Go to Login
      </a>
    </div>

    <p>If you did not request this change, please contact our support team immediately.</p>

    <p>Thank you for using our platform!</p>
    <p>Best regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p>&copy; 2024 Your App, Inc. All rights reserved.</p>
  </div>
</body>
</html>
`;
