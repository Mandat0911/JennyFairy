export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  
  <!-- Header -->
  <div style="text-align: center; padding: 30px 0;">
    <img src="https://res.cloudinary.com/dmzfjdowd/image/upload/v1743621391/logoEmail_fyemfp.png" 
         alt="JennyFairy Logo" style="max-width: 180px;">
  </div>

  <!-- Main Container -->
  <div style="background: #ffffff; padding: 40px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); text-align: center;">
    
    <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 15px; color: #333;">Verify Your Email Address</h1>
    
    <p style="font-size: 16px; margin-bottom: 20px; color: #444;">
      Hello <strong>{{userName}}</strong>,
    </p>

    <p style="font-size: 15px; margin-bottom: 20px; color: #444;">
      Thank you for signing up with <strong>JennyFairy</strong>. To complete your registration, please verify your email address by clicking the button below:
    </p>

    <div style="background-color: #000; color: #fff; padding: 15px; font-size: 18px; font-weight: bold; display: block; letter-spacing: 1px; margin-top: 20px; border-radius: 5px;">
          {{verificationToken}}
    </div>

    <!-- Verification Button -->
    <a href="{{verificationLink}}" 
       style="display: inline-block; background: black; color: white; text-decoration: none; font-size: 14px; font-weight: bold; padding: 12px 25px; border-radius: 3px; margin-top: 20px;">
      Verify My Email
    </a>

    <p style="font-size: 14px; margin-top: 20px; color: #666;">
      If you did not request this, please ignore this email.
    </p>

  </div>

  <!-- Footer -->
  <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
    <p>&copy; 2024 JennyFairy. All rights reserved.</p>
    <p>This is an automated message, please do not reply.</p>
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
<body style="font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">

  <!-- Header Section with Logo -->
  <div style="background: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <img src="https://res.cloudinary.com/dmzfjdowd/image/upload/v1743621391/logoEmail_fyemfp.png" alt="JennyFairy Logo" style="max-width: 150px; margin-bottom: 10px;">
    <h1 style="color: #111; font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Welcome to JennyFairy</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: white; padding: 25px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #555;">Hey <strong>{{userName}}</strong>,</p>
    <p style="font-size: 16px; color: #444;">You’re officially part of the <strong>JennyFairy</strong> family! It’s time to elevate your wardrobe with effortlessly chic pieces.</p>

    <p style="font-size: 16px; font-weight: 500; color: #222;">Here’s what’s waiting for you:</p>

    <!-- Stylish CTA Section -->
    <div style="margin: 20px 0; background-color: #f7f7f7; padding: 20px; border-radius: 8px; font-size: 15px;">
      <ul style="list-style: none; padding: 0; margin: 0; color: #444; font-weight: 500;">
        <li style="margin-bottom: 10px;">✨ <strong>Shop New Arrivals</strong> – Discover the latest must-haves.</li>
        <li style="margin-bottom: 10px;">💡 <strong>Get Inspired</strong> – Browse our curated lookbooks.</li>
        <li style="margin-bottom: 10px;">🎁 <strong>Exclusive Perks</strong> – Enjoy members-only discounts.</li>
      </ul>
    </div>

    <!-- Main Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://jennyfairy.store" 
         style="text-decoration: none; background-color: #000; color: white; padding: 14px 32px; font-size: 16px; border-radius: 50px; font-weight: bold; letter-spacing: 0.5px; display: inline-block; transition: background 0.3s ease;">
        EXPLORE NOW →
      </a>
    </div>

    <p style="font-size: 15px; color: #555;">Need assistance? Our team is always here to help. Reach out via email or follow us on social media.</p>

    <p style="font-size: 16px; font-weight: 500; color: #222;">See you soon, fashion icon. ✨</p>
    <p style="font-size: 14px; color: #777;">- The JennyFairy Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
    <p>This email was sent automatically—no need to reply. But we'd love to connect! Follow us on social media.</p>
    <p style="margin-top: 10px;">&copy; 2024 JennyFairy. All rights reserved.</p>
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
<body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <!-- Header Section -->
  <div style="background: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <!-- Brand Logo -->
     <img src="https://res.cloudinary.com/dmzfjdowd/image/upload/v1743621391/logoEmail_fyemfp.png" alt="JennyFairy Logo" style="max-width: 150px; margin-bottom: 10px;">
    <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Reset Your Password</h1>
  </div>

  <!-- Body Content -->
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <p style="font-size: 16px;">Hello <strong>{{userName}}</strong>,</p>
    <p style="font-size: 16px;">We received a request to reset your password. Click the button below to regain access to <strong>JennyFairy</strong>:</p>

    <!-- Reset Link -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetLink}" 
         style="text-decoration: none; background-color: #000; color: white; padding: 14px 28px; font-size: 16px; font-weight: bold; border-radius: 50px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">If you did not request this change, simply ignore this email.</p>

    <p style="font-size: 14px; color: #777;">Need assistance? <a href="mailto:nguyenmandat0744@gmail.com?subject=Support Request&body=Hello, I need help with..." style="color: #000; text-decoration: none; font-weight: bold; border-bottom: 2px solid #000;">Contact our support team</a>.</p>

    <p style="font-size: 14px; font-weight: bold;">Stay chic,<br>The JennyFairy Team</p>
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
<body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  
  <!-- Header -->
  <div style="text-align: center; padding: 30px 0;">
    <img src="https://res.cloudinary.com/dmzfjdowd/image/upload/v1743621391/logoEmail_fyemfp.png" alt="JennyFairy Logo" style="max-width: 180px;">
  </div>

  <!-- Main Container -->
  <div style="background: #ffffff; padding: 40px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); text-align: center;">
    
    <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Password Reset Successful</h1>
    
    <p style="font-size: 16px; margin-bottom: 20px; color: #444;">Hello <strong>{{userName}}</strong>,</p>
    
    <p style="font-size: 15px; margin-bottom: 20px; color: #444;">Your password has been successfully updated. You can now log in and continue discovering our latest collections.</p>
    
    <a href="{{resetLink}}" 
       style="display: inline-block; background: black; color: white; text-decoration: none; font-size: 14px; font-weight: bold; padding: 12px 25px; border-radius: 3px; margin-top: 20px;">
      Log In Now
    </a>

    <p style="font-size: 14px; margin-top: 25px; color: #666;">If you didn’t request this, please contact our support team immediately.</p>
    
  </div>

  <!-- Footer -->
  <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
    <p>&copy; 2024 JennyFairy. All rights reserved.</p>
    <p>This is an automated message, please do not reply.</p>
  </div>

</body>
</html>
`;

export const ORDER_CONFIRMATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  
  <!-- Header -->
  <div style="text-align: center; padding: 30px 0;">
    <img src="https://res.cloudinary.com/dmzfjdowd/image/upload/v1743621391/logoEmail_fyemfp.png" alt="JennyFairy Logo" style="max-width: 180px;">
  </div>

  <!-- Main Container -->
  <div style="background: #ffffff; padding: 40px; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); text-align: center;">
    
    <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 15px;">Thank You for Your Order!</h1>
    
    <p style="font-size: 16px; margin-bottom: 20px; color: #444;">Hello <strong>{{userName}}</strong>,</p>
    
    <p style="font-size: 15px; margin-bottom: 20px; color: #444;">
      Your order <strong>#{{orderId}}</strong> has been successfully placed.
    </p>

    <!-- Order Details -->
    <div style="text-align: left; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #fafafa;">
      <p><strong>Order ID:</strong> {{orderId}}</p>
      <p><strong>Order Date:</strong> {{orderDate}}</p>
      <p><strong>Total Amount:</strong> <span style="color: #d32f2f;">{{totalAmount}} VND</span></p>
      
      <h3 style="font-size: 18px; font-weight: 600; margin-top: 15px;">Products Ordered:</h3>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: left;">Product</th>
            <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: center;">Size</th>
            <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: center;">Qty</th>
            <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          {{orderItems}}
        </tbody>
      </table>

      <h3 style="font-size: 18px; font-weight: 600; margin-top: 15px;">Shipping Details:</h3>
      <p><strong>Name:</strong> {{fullName}}</p>
      <p><strong>Phone:</strong> {{phone}}</p>
      <p><strong>Address:</strong> {{address}}, {{city}}, {{postalCode}}, {{country}}</p>
      <p><strong>Delivery Status:</strong> <span style="color: #FFA500;">Pending</span></p>
    </div>

    <p style="font-size: 14px; margin-top: 20px; color: #666;">
      You will receive an update once your order has been shipped. You can track your order status in your account.
    </p>

    <a href="{{trackingLink}}" 
       style="display: inline-block; background: black; color: white; text-decoration: none; font-size: 14px; font-weight: bold; padding: 12px 25px; border-radius: 3px; margin-top: 20px;">
      Track Your Order
    </a>

    <p style="font-size: 14px; margin-top: 25px; color: #666;">If you have any questions, feel free to contact our support team.</p>
    
  </div>

  <!-- Footer -->
  <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
    <p>&copy; 2024 JennyFairy. All rights reserved.</p>
    <p>This is an automated message, please do not reply.</p>
  </div>

</body>
</html>

`;
