// This component disables auth protection for local development only
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function DevBypassProtectedRoute({ children }) {
  // Only bypass in development (localhost)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (isLocal) {
    return children;
  }
  // Fallback to normal protected route logic if not local
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
