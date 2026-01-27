import mongoose from "mongoose";

// Application Form Schema
const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Personal Details
    fullName: String,
    dateOfBirth: Date,
    passportNumber: String,
    nationality: String,
    contactEmail: String,
    phoneNumber: String,

    // Education Background
    educationLevel: String,
    institution: String,
    fieldOfStudy: String,
    graduationYear: Number,
    gpa: Number,

    // Intended Course & University
    courseType: String,
    universityName: String,
    courseName: String,
    startDate: Date,

    // Financial Proof
    familyIncome: Number,
    savingsAmount: Number,
    sponsorName: String,
    sponsorRelation: String,

    // Home Country Ties
    propertyOwnership: String,
    familyMembers: Number,
    employment: String,

    // Statement of Purpose
    sopText: String,

    // Interview History
    hasInterviewExperience: Boolean,
    interviewNotes: String,

    // Application Status
    status: {
      type: String,
      enum: ["draft", "completed", "submitted"],
      default: "draft",
    },

    // Completion percentage
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Index for faster queries
applicationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Application", applicationSchema);
