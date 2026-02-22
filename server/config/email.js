import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  // Check if we're using Gmail or custom SMTP
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  } else {
    // Custom SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "AI Visa Success Advisor"} <${
        process.env.EMAIL_USER || process.env.SMTP_USER
      }>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message, // Support both HTML and plain text
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Password reset email template
export const getPasswordResetEmailTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9fafb;
          border-radius: 10px;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .content {
          background-color: white;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(to right, #3b82f6, #6366f1);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background: linear-gradient(to right, #2563eb, #4f46e5);
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px;
          margin-top: 20px;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 20px;
        }
        .reset-link {
          background-color: #f3f4f6;
          padding: 10px;
          border-radius: 4px;
          word-break: break-all;
          margin: 15px 0;
          font-size: 12px;
          color: #4b5563;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✓ AI Visa Success Advisor</div>
          <h2 style="color: #1f2937; margin: 0;">Password Reset Request</h2>
        </div>
        
        <div class="content">
          <p>Hello${userName ? ` ${userName}` : ""},</p>
          
          <p>We received a request to reset your password for your AI Visa Success Advisor account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <div class="reset-link">${resetUrl}</div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          
          <p style="margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} AI Visa Success Advisor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
