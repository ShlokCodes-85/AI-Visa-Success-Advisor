import express from "express";
import Analysis from "../models/Analysis.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all analyses for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-formData -shapValues -limeExplanation"); // Exclude heavy data for list view
    
    res.json({ analyses });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// Get a specific analysis by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    res.json({ analysis });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

// Create a new analysis
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, percentage, reasoning, improvements, formData, shapValues, limeExplanation } = req.body;

    // Validate required fields
    if (percentage === undefined || !reasoning || !improvements || !formData) {
      return res.status(400).json({ 
        error: "Missing required fields: percentage, reasoning, improvements, formData" 
      });
    }

    // Validate percentage range
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ error: "Percentage must be between 0 and 100" });
    }

    const analysis = new Analysis({
      userId: req.user.userId,
      email: req.user.email,
      title: title || `Analysis ${new Date().toLocaleDateString()}`,
      percentage,
      reasoning,
      improvements,
      formData,
      shapValues,
      limeExplanation,
    });

    await analysis.save();

    res.status(201).json({ 
      message: "Analysis saved successfully",
      analysis: {
        id: analysis._id,
        title: analysis.title,
        percentage: analysis.percentage,
        createdAt: analysis.createdAt,
      }
    });
  } catch (error) {
    console.error("Error creating analysis:", error);
    res.status(500).json({ error: "Failed to save analysis" });
  }
});

// Update an analysis
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    const analysis = await Analysis.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title },
      { new: true }
    );

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    res.json({ 
      message: "Analysis updated successfully",
      analysis 
    });
  } catch (error) {
    console.error("Error updating analysis:", error);
    res.status(500).json({ error: "Failed to update analysis" });
  }
});

// Delete an analysis
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    res.json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({ error: "Failed to delete analysis" });
  }
});

export default router;
