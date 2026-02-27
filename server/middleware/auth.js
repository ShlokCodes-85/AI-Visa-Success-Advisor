import jwt from "jsonwebtoken";

// Alias used by routes; keeps compatibility if middleware name changes.
export const protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("[AUTH] Authorization header:", authHeader);
  
  const token = authHeader && authHeader.split(" ")[1];
  console.log("[AUTH] Extracted token:", token ? "present" : "missing");

  if (!token) {
    console.log("[AUTH] No token provided - returning 401");
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("[AUTH] JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    console.log("[AUTH] JWT verified successfully - User:", user);
    req.user = user;
    next();
  });
};

// Backward-compatible export if other modules import authenticateToken directly.
export const authenticateToken = protect;
