import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      alert("OAuth authentication failed. Please try again.");
      navigate("/");
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem("token", token);
      
      // Redirect to application form
      navigate("/application");
      
      // Optionally reload to update auth state
      window.location.reload();
    } else {
      // No token found, redirect to home
      navigate("/");
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
}
