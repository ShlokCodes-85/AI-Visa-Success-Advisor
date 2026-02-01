import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value.trim());

router.post("/", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.json({
        success: true,
        message: "You're already subscribed. Thanks for staying connected!",
      });
    }

    await Subscription.create({ email, source: "footer" });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully!",
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({ message: "Unable to subscribe right now." });
  }
});

export default router;
