import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordValidation = {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(password),
    isLengthValid: password.length >= 8 && password.length <= 15,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      setError("Password does not meet all requirements");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Store token and redirect to application after 2 seconds
        if (data.token) {
          localStorage.setItem("token", data.token);
          setTimeout(() => {
            navigate("/application");
          }, 2000);
        }
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <FaCheck className="text-white text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-green-700 dark:text-green-300">
              Your password has been reset successfully. Redirecting you to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Reset Your Password
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Enter your new password"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
            {passwordFocused && (
              <div className="mt-3 space-y-2">
                <PasswordRequirement
                  met={passwordValidation.hasUppercase}
                  text="One uppercase letter (A-Z)"
                />
                <PasswordRequirement
                  met={passwordValidation.hasLowercase}
                  text="One lowercase letter (a-z)"
                />
                <PasswordRequirement
                  met={passwordValidation.hasSpecialChar}
                  text="One special character"
                />
                <PasswordRequirement
                  met={passwordValidation.isLengthValid}
                  text="8-15 characters long"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="flex items-center gap-1 text-red-500 text-sm font-medium mt-2">
                <MdClose className="text-red-500" />
                <span>Passwords do not match</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>

          {error && (
            <div className="text-red-500 text-sm font-medium text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-500 dark:text-blue-400 font-semibold hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${met ? "text-green-600" : "text-red-600"}`}>
      {met ? (
        <FaCheck className="text-green-600 text-xs" />
      ) : (
        <MdClose className="text-red-600" />
      )}
      <span>{text}</span>
    </div>
  );
}
