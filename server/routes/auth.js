import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail, getPasswordResetEmailTemplate } from "../config/email.js";

const router = express.Router();

// Password validation function
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8 || password.length > 15) {
    errors.push("Password must be between 8-15 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return errors;
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        message: "Password does not meet requirements",
        errors: passwordErrors 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Allow local login if a password exists, regardless of authProvider value
    if (!user.password) {
      return res.status(400).json({
        message: `This account doesn't have a password set. Please sign in with OAuth (${user.authProvider}) or set a password via your account settings.`,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: `${process.env.CLIENT_URL}/?error=oauth_failed`,
    session: true 
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/?error=token_generation_failed`);
    }
  }
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { 
    failureRedirect: `${process.env.CLIENT_URL}/?error=oauth_failed`,
    session: true 
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
    } catch (error) {
      console.error("GitHub OAuth callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/?error=token_generation_failed`);
    }
  }
);

// Get current user (protected route)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Update profile photo (protected route)
router.put("/profile-photo", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { profilePhoto } = req.body;

    if (!profilePhoto) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { profilePhoto },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile photo updated successfully", user });
  } catch (error) {
    console.error("Profile photo update error:", error);
    res.status(500).json({ message: "Failed to update profile photo" });
  }
});

// Remove profile photo (protected route)
router.delete("/profile-photo", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { profilePhoto: null },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile photo removed successfully", user });
  } catch (error) {
    console.error("Profile photo delete error:", error);
    res.status(500).json({ message: "Failed to remove profile photo" });
  }
});

// Forgot Password - Generate reset token and send email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        message: "If an account exists with this email, you will receive password reset instructions." 
      });
    }

    // Only allow password reset for local auth users
    if (user.authProvider !== "local") {
      return res.status(400).json({ 
        message: `This account uses ${user.authProvider} authentication. Please use ${user.authProvider} to sign in.` 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || process.env.FRONTEND_URL_LOCAL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Send password reset email
    try {
      const emailHtml = getPasswordResetEmailTemplate(resetUrl, user.fullName);
      
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - AI Visa Success Advisor",
        message: `You requested a password reset. Click this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
        html: emailHtml,
      });

      console.log("Password reset email sent successfully to:", user.email);
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      // Clear the reset token since email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        message: "Failed to send reset email. Please try again later or contact support." 
      });
    }

    res.json({ 
      message: "Password reset instructions have been sent to your email.",
      // Only include reset token in development for testing
      ...(process.env.NODE_ENV === "development" && { 
        resetToken,
        resetUrl // Also include URL in dev mode for easy testing
      })
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error processing password reset request" });
  }
});

// Reset Password - Verify token and update password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        message: "Password does not meet requirements",
        errors: passwordErrors 
      });
    }

    // Hash the token from URL to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Password reset token is invalid or has expired" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new JWT token for automatic login
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Password has been reset successfully",
      token: jwtToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

export default router;
