import mongoose from "mongoose";

// Chat Schema
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: false,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model("Chat", chatSchema);
