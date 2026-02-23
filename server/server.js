import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chats.js";
import applicationRoutes from "./routes/applications.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import { configurePassport } from "./config/passport.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_URL
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// Session configuration using MongoDB-backed store
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport configuration
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Database connection with graceful fallback
let isConnected = false;

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in environment variables");
    return;
  }
  
  let retries = 0;
  const attemptConnect = async () => {
    try {
      console.log(`🔄 Attempting to connect to MongoDB Atlas (attempt ${retries + 1}/3)...`);
      await mongoose.connect(MONGODB_URI, {
        dbName: "visa-advisor",
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        family: 4, // Force IPv4
      });
      isConnected = true;
      console.log("✅ Connected to MongoDB Atlas successfully");
    } catch (error) {
      retries += 1;
      console.error("❌ MongoDB connection error:", error.message);
      if (retries < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * retries;
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        setTimeout(attemptConnect, delay);
      } else {
        console.error("🛑 MongoDB connection failed after maximum retries");
      }
    }
  };

  attemptConnect();
};

// Connect to DB (non-blocking)
connectDB().catch((err) => {
  console.warn("DB connection initialization error (non-fatal):", err.message);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Visa Auth API is running",
    mongodb: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get("/api/health", (req, res) => {
  const dbReadyState = mongoose.connection.readyState;
  const dbConnected = isConnected && dbReadyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    mongodb: dbConnected ? "connected" : "disconnected",
    dbReadyState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  console.error("Error stack:", err.stack);
  console.error("Request URL:", req.url);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server (suitable for Render / standard Node hosting)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
