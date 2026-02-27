import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: function() {
        return `Analysis ${new Date().toLocaleDateString()}`;
      },
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    reasoning: [
      {
        factor: {
          type: String,
          required: true,
        },
        impact: {
          type: String,
          enum: ["positive", "negative", "neutral"],
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          min: 0,
          max: 1,
        },
      },
    ],
    improvements: [
      {
        category: {
          type: String,
          required: true,
        },
        suggestion: {
          type: String,
          required: true,
        },
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
          default: "medium",
        },
      },
    ],
    formData: {
      type: Object,
      required: true,
    },
    // SHAP and LIME explanations (to be added later)
    shapValues: {
      type: Object,
      default: null,
    },
    limeExplanation: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ email: 1, createdAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
