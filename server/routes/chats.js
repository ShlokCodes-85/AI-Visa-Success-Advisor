import express from "express";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Middleware to protect routes
router.use(protect);

// Create a new chat
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Chat title is required" });
    }

    console.log(`[CREATE CHAT] User ${req.user.id} creating chat: "${title.trim()}"`);
    
    const chat = await Chat.create({
      userId: req.user.id,
      email: req.user.email || "",
      title: title.trim(),
      messages: [],
    });

    console.log(`[CREATE CHAT] Successfully created chat ${chat._id} for user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat: {
        id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    console.error(`[CREATE CHAT ERROR] User ${req.user.id}:`, error);
    res.status(500).json({ message: "Error creating chat" });
  }
});

// Get all chats for the user
router.get("/", async (req, res) => {
  try {
    console.log(`[FETCH CHATS] User ${req.user.id} requesting their chats`);
    
    // Allow lookup by userId or email (supports sessions where user id may differ)
    const ownershipFilter = {
      $or: [
        { userId: req.user.id },
        ...(req.user.email ? [{ email: req.user.email }] : []),
      ],
    };

    const chats = await Chat.find(ownershipFilter)
      .select("_id title createdAt updatedAt")
      .sort({ updatedAt: -1 });

    console.log(`[FETCH CHATS] Found ${chats.length} chats for user ${req.user.id}`);

    res.json({
      success: true,
      chats,
      total: chats.length,
    });
  } catch (error) {
    console.error(`[FETCH CHATS ERROR] User ${req.user.id}:`, error);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

// Get a specific chat with message history
router.get("/:chatId", async (req, res) => {
  try {
    console.log(`[FETCH CHAT] User ${req.user.id} requesting chat ${req.params.chatId}`);
    
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id,
    });

    if (!chat) {
      console.log(`[FETCH CHAT] Chat ${req.params.chatId} not found for user ${req.user.id} (may belong to another user)`);
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log(`[FETCH CHAT] Found chat ${chat._id} with ${chat.messages.length} messages for user ${req.user.id}`);
    
    res.json({
      success: true,
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    console.error(`[FETCH CHAT ERROR] User ${req.user.id}, Chat ${req.params.chatId}:`, error);
    res.status(500).json({ message: "Error fetching chat" });
  }
});

// Add a message to a chat
router.post("/:chatId/messages", async (req, res) => {
  try {
    const { role, content } = req.body;
    console.log("Adding message to chat:", req.params.chatId, "Role:", role, "Content length:", content?.length);

    if (!role || !content) {
      return res
        .status(400)
        .json({ message: "Role and content are required" });
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id,
    });

    if (!chat) {
      console.log("Chat not found for ID:", req.params.chatId, "User ID:", req.user.id);
      return res.status(404).json({ message: "Chat not found" });
    }

    // Add message
    chat.messages.push({
      role,
      content,
      timestamp: new Date(),
    });

    console.log("Message added. Total messages in chat:", chat.messages.length);

    // Keep only last 50 messages to save space
    if (chat.messages.length > 50) {
      chat.messages = chat.messages.slice(-50);
    }

    await chat.save();
    console.log("Chat saved successfully");

    res.status(201).json({
      success: true,
      message: "Message added successfully",
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Error adding message" });
  }
});

// Get messages from a chat
router.get("/:chatId/messages", async (req, res) => {
  try {
    console.log("Fetching messages for chat:", req.params.chatId, "User ID:", req.user.id);
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id,
    }).select("messages");

    if (!chat) {
      console.log("Chat not found for message fetch");
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log("Found", chat.messages.length, "messages");
    res.json({
      success: true,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Update chat title
router.put("/:chatId", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Chat title is required" });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    ).select("_id title");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({
      success: true,
      message: "Chat updated successfully",
      chat,
    });
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ message: "Error updating chat" });
  }
});

// Delete a chat
router.delete("/:chatId", async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      userId: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Error deleting chat" });
  }
});

export default router;
