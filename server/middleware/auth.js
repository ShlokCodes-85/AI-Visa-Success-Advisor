import jwt from "jsonwebtoken";

// Alias used by routes; keeps compatibility if middleware name changes.
export const protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("[AUTH] Authorization header:", authHeader);
  
  const token = authHeader && authHeader.split(" ")[1];
  console.log("[AUTH] Extracted token:", token ? "present" : "missing");

  if (!token) {
    // Allow guest user for chat feature
    console.log("[AUTH] No token provided - creating guest user");
    req.user = {
      id: "guest_" + Date.now(),
      type: "guest",
      isGuest: true
    };
    return next();
  }

  // const jwtSecret = process.env.JWT_SECRET;
  // if (!jwtSecret || jwtSecret === "your_jwt_secret_here_generate_a_random_string") {
  //   console.error("[AUTH] JWT_SECRET not properly configured");
  //   return res.status(500).json({ message: "Server configuration error: JWT_SECRET not configured" });
  // }

  const isDev = process.env.NODE_ENV !== "production";
  const rawJwtSecret = process.env.JWT_SECRET;
  if (!rawJwtSecret) {
    if (!isDev) {
      console.error("[AUTH] JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error: JWT_SECRET not configured" });
    }
    console.warn("[AUTH] JWT_SECRET missing - using dev fallback");
  } else if (rawJwtSecret === "your_jwt_secret_here_generate_a_random_string" && isDev) {
    console.warn("[AUTH] JWT_SECRET is placeholder - allowing in development");
  }

  const jwtSecret = rawJwtSecret || "dev_jwt_secret_local";

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log("[AUTH] JWT verification failed:", err.message);
      // Allow guest user on JWT errors (for chat feature)
      console.log("[AUTH] Allowing guest user due to JWT error");
      req.user = {
        id: "guest_" + Date.now(),
        type: "guest",
        isGuest: true
      };
      return next();
    }
    console.log("[AUTH] JWT verified successfully - User:", user);
    req.user = user;
    next();
  });
};

// Backward-compatible export if other modules import authenticateToken directly.
export const authenticateToken = protect;

// Strict authentication - requires valid JWT, no guest users allowed
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("[REQUIRE_AUTH] Authorization header:", authHeader);
  
  const token = authHeader && authHeader.split(" ")[1];
  console.log("[REQUIRE_AUTH] Extracted token:", token ? "present" : "missing");

  if (!token) {
    console.log("[REQUIRE_AUTH] No token provided - rejecting request");
    return res.status(401).json({ message: "Access token required" });
  }

  const isDev = process.env.NODE_ENV !== "production";
  const rawJwtSecret = process.env.JWT_SECRET;
  if (!rawJwtSecret) {
    if (!isDev) {
      console.error("[REQUIRE_AUTH] JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error: JWT_SECRET not configured" });
    }
    console.warn("[REQUIRE_AUTH] JWT_SECRET missing - using dev fallback");
  }

  const jwtSecret = rawJwtSecret || "dev_jwt_secret_local";

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log("[REQUIRE_AUTH] JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    console.log("[REQUIRE_AUTH] JWT verified successfully - User:", user);
    req.user = user;
    next();
  });
};
