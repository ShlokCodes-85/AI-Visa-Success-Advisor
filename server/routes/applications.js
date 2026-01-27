import express from "express";
import Application from "../models/Application.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Middleware to protect routes
router.use(protect);

// Helper function to calculate completion percentage
const calculateCompletion = (data) => {
  const sections = {
    personalDetails: [
      "fullName",
      "dateOfBirth",
      "passportNumber",
      "nationality",
      "contactEmail",
      "phoneNumber",
    ],
    education: [
      "educationLevel",
      "institution",
      "fieldOfStudy",
      "graduationYear",
      "gpa",
    ],
    course: ["courseType", "universityName", "courseName", "startDate"],
    financial: ["familyIncome", "savingsAmount", "sponsorName", "sponsorRelation"],
    ties: ["propertyOwnership", "familyMembers", "employment"],
    sop: ["sopText"],
    interview: ["hasInterviewExperience"],
  };

  let completed = 0;
  let total = 0;

  for (const section in sections) {
    for (const field of sections[section]) {
      total++;
      if (data[field] && data[field].toString().trim() !== "") {
        completed++;
      }
    }
  }

  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

// Get or create user's application
router.get("/", async (req, res) => {
  try {
    let application = await Application.findOne({ userId: req.user.id });

    if (!application) {
      application = await Application.create({
        userId: req.user.id,
        status: "draft",
        completionPercentage: 0,
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Error fetching application" });
  }
});

// Update application (partial update)
router.put("/", async (req, res) => {
  try {
    let application = await Application.findOne({ userId: req.user.id });

    if (!application) {
      application = new Application({ userId: req.user.id });
    }

    // Update fields from request body
    const allowedFields = [
      "fullName",
      "dateOfBirth",
      "passportNumber",
      "nationality",
      "contactEmail",
      "phoneNumber",
      "educationLevel",
      "institution",
      "fieldOfStudy",
      "graduationYear",
      "gpa",
      "courseType",
      "universityName",
      "courseName",
      "startDate",
      "familyIncome",
      "savingsAmount",
      "sponsorName",
      "sponsorRelation",
      "propertyOwnership",
      "familyMembers",
      "employment",
      "sopText",
      "hasInterviewExperience",
      "interviewNotes",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    }

    // Calculate completion percentage
    application.completionPercentage = calculateCompletion(application);

    await application.save();

    res.json({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Error updating application" });
  }
});

// Get completion status
router.get("/status", async (req, res) => {
  try {
    const application = await Application.findOne({
      userId: req.user.id,
    }).select("completionPercentage status");

    if (!application) {
      return res.json({
        success: true,
        completionPercentage: 0,
        status: "draft",
      });
    }

    res.json({
      success: true,
      completionPercentage: application.completionPercentage,
      status: application.status,
    });
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).json({ message: "Error fetching status" });
  }
});

// Submit application
router.post("/submit", async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { userId: req.user.id },
      { status: "submitted" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // TODO: Send email, trigger backend processes, etc.

    res.json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ message: "Error submitting application" });
  }
});

export default router;
