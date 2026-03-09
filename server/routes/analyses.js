import express from "express";
import Analysis from "../models/Analysis.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Always return fresh data for analyses endpoints.
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Get all analyses for the current user
router.get("/", requireAuth, async (req, res) => {
  try {
    console.log("[ANALYSES] Fetching analyses for user:", req.user);
    console.log("[ANALYSES] User ID:", req.user.id);
    console.log("[ANALYSES] User Email:", req.user.email);
    
    const ownershipFilter = {
      $or: [
        { user_id: req.user.id },
        ...(req.user.email ? [{ email: req.user.email }] : []),
      ],
    };

    console.log("[ANALYSES] Ownership filter:", ownershipFilter);

    const analyses = await Analysis.find(ownershipFilter)
      .sort({ created_at: -1 })
      .select("-form_data -analysis_results.explanations"); // Exclude heavy data for list view
    
    console.log("[ANALYSES] Found", analyses.length, "analyses");
    if (analyses.length > 0) {
      console.log("[ANALYSES] First analysis:", { 
        id: analyses[0]._id, 
        title: analyses[0].title, 
        email: analyses[0].email,
        user_id: analyses[0].user_id,
        percentage: analyses[0].analysis_results?.percentage
      });
    }
    
    // Transform to match frontend expectations
    const transformedAnalyses = analyses.map(a => ({
      _id: a._id,
      title: a.title,
      email: a.email,
      percentage: a.analysis_results?.percentage,
      createdAt: a.created_at,
      formData: {
        personalDetails: {
          firstName: a.form_data?.personal_details?.first_name || "",
          lastName: a.form_data?.personal_details?.last_name || "",
          email: a.email,
        }
      }
    }));
    
    res.json({ analyses: transformedAnalyses });
  } catch (error) {
    console.error("[ANALYSES] Error fetching analyses:", error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// Get a specific analysis by ID
router.get("/:id([0-9a-fA-F]{24})", requireAuth, async (req, res) => {
  try {
    const ownershipFilter = {
      $or: [
        { user_id: req.user.id },
        ...(req.user.email ? [{ email: req.user.email }] : []),
      ],
    };

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      ...ownershipFilter,
    });

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    // Transform to match frontend expectations
    const transformed = {
      _id: analysis._id,
      title: analysis.title,
      email: analysis.email,
      percentage: analysis.analysis_results?.percentage,
      reasoning: analysis.analysis_results?.reasoning || [],
      improvements: analysis.analysis_results?.improvements || [],
      formData: analysis.form_data || {},
      createdAt: analysis.created_at,
    };

    res.json({ analysis: transformed });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

// Create a new analysis
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, percentage, reasoning, improvements, formData, summary, explanations } = req.body;

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
      user_id: req.user.id,
      email: req.user.email,
      title: title || `Analysis ${new Date().toLocaleDateString()}`,
      form_data: formData,
      analysis_results: {
        percentage,
        summary,
        reasoning,
        improvements,
        explanations,
      },
    });

    await analysis.save();

    res.status(201).json({ 
      message: "Analysis saved successfully",
      analysis: {
        id: analysis._id,
        title: analysis.title,
        percentage: analysis.analysis_results.percentage,
        createdAt: analysis.created_at,
      }
    });
  } catch (error) {
    console.error("Error creating analysis:", error);
    res.status(500).json({ error: "Failed to save analysis" });
  }
});

// Update an analysis
router.put("/:id([0-9a-fA-F]{24})", requireAuth, async (req, res) => {
  try {
    const { title } = req.body;

    const ownershipFilter = {
      $or: [
        { user_id: req.user.id },
        ...(req.user.email ? [{ email: req.user.email }] : []),
      ],
    };

    const analysis = await Analysis.findOneAndUpdate(
      { _id: req.params.id, ...ownershipFilter },
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
router.delete("/:id([0-9a-fA-F]{24})", requireAuth, async (req, res) => {
  try {
    const ownershipFilter = {
      $or: [
        { user_id: req.user.id },
        ...(req.user.email ? [{ email: req.user.email }] : []),
      ],
    };

    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      ...ownershipFilter,
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

// Debug route - check all analyses in database
router.get("/debug/all", requireAuth, async (req, res) => {
  try {
    console.log("[DEBUG] Current user:", req.user);
    
    // Get all analyses without filtering by user_id
    const allAnalyses = await Analysis.find({})
      .select("user_id email title analysis_results.percentage created_at")
      .limit(20);
    
    console.log("[DEBUG] Total analyses in DB:", allAnalyses.length);
    
    // Get analyses for current user
    const ownershipFilter = {
      $or: [
        { user_id: req.user.id },
        ...(req.user.email ? [{ email: req.user.email }] : []),
      ],
    };

    const userAnalyses = await Analysis.find(ownershipFilter)
      .select("user_id email title analysis_results.percentage created_at");
    
    console.log("[DEBUG] Analyses for current user:", userAnalyses.length);
    
    res.json({ 
      currentUser: req.user,
      totalInDB: allAnalyses.length,
      forCurrentUser: userAnalyses.length,
      allAnalyses: allAnalyses.map(a => ({
        id: a._id,
        user_id: a.user_id,
        email: a.email,
        title: a.title,
        percentage: a.analysis_results?.percentage,
        matchesCurrentUser: a.user_id === req.user.id || a.email === req.user.email
      }))
    });
  } catch (error) {
    console.error("[DEBUG] Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
