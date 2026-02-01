import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    // Provider-specific IDs allow linking multiple OAuth methods
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    githubId: {
      type: String,
      sparse: true,
      index: true,
    },
    // Deprecated: kept for backward compatibility if previously used
    providerId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
