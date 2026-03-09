import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
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
    form_data: {
      type: Object,
      required: true,
    },
    analysis_results: {
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      summary: {
        type: String,
      },
      reasoning: [
        {
          factor: String,
          impact: String,
          description: String,
          weight: Number,
        },
      ],
      improvements: [
        {
          category: String,
          suggestion: String,
          priority: String,
        },
      ],
      explanations: {
        type: Object,
        default: null,
      },
    },
  },
  {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    },
    collection: 'form_analyses'
  }
);

// Index for efficient queries
analysisSchema.index({ user_id: 1, created_at: -1 });
analysisSchema.index({ email: 1, created_at: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
