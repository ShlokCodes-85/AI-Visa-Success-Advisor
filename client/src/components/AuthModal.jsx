import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { IoClose, IoArrowBack } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function AuthModal({ onClose }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formError, setFormError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const passwordValidation = {
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(formData.password),
    isLengthValid: formData.password.length >= 8 && formData.password.length <= 15,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleModeSwitch = () => {
    setMode(mode === "login" ? "signup" : "login");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setPasswordFocused(false);
    setResetSuccess(false);
    if (formError) setFormError("");
  };

  const handleForgotPassword = () => {
    setMode("forgot-password");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormError("");
    setResetSuccess(false);
  };

  const handleBackToLogin = () => {
    setMode("login");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormError("");
    setResetSuccess(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetSuccess(true);
      } else {
        setFormError(data.message || "Failed to send reset email. Please try again.");
      }
    } catch {
      setFormError("An error occurred. Please try again later.");
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `${BACKEND_URL}/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const body = mode === "login" 
      ? { email: formData.email, password: formData.password }
      : { fullName: formData.fullName, email: formData.email, password: formData.password };

    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      onClose();
      // Navigate to application form
      navigate("/application");
    } else {
      // Map backend messages to clear, user-facing inline errors
      const msg = data && data.message ? data.message : "Authentication failed";
      const lower = msg.toLowerCase();
      if (lower.includes("not register")) {
        setFormError("User not registered. Please SignUp to continue.");
      } else if (lower.includes("invalid") || lower.includes("incorrect") || lower.includes("wrong")) {
        setFormError("Invalid Email or Password");
      } else {
        setFormError(msg);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full ${mode === "signup" ? "max-w-[450px]" : "max-w-[400px]"} bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl dark:shadow-gray-900/50 relative transform transition-all`}>
        {mode === "forgot-password" ? (
          <button
            onClick={handleBackToLogin}
            className="absolute left-2 top-2 p-1 bg-white dark:bg-gray-700 border border-transparent rounded hover:border-transparent dark:hover:border-gray-400 transition-all"
          >
            <IoArrowBack className="text-lg text-black dark:text-gray-100" />
          </button>
        ) : null}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 bg-white dark:bg-gray-700 border border-transparent rounded hover:border-transparent dark:hover:border-gray-400 transition-all"
        >
          <IoClose className="text-lg text-black dark:text-gray-100" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {mode === "login" ? "Welcome Back!" : mode === "signup" ? "Create Account" : "Reset Password"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-5">
          {mode === "login" 
            ? "Sign in to continue your visa journey" 
            : mode === "signup" 
            ? "Start your visa success journey today"
            : "Enter your email to receive password reset instructions"}
        </p>

        {/* Forgot Password Form */}
        {mode === "forgot-password" ? (
          <>
            {resetSuccess ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-xl" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Check Your Email</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We've sent password reset instructions to <strong>{formData.email}</strong>
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Please check your inbox and follow the link to reset your password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none focus:outline-none transition-all text-sm placeholder-gray-500 dark:placeholder-gray-400"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                  Send Reset Link
                </button>

                {formError && (
                  <div className="text-red-500 text-sm font-medium mt-3 text-center">
                    {formError}
                  </div>
                )}
              </form>
            )}
          </>
        ) : (
          /* Login/Signup Form */
          <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  placeholder="Enter your full name"
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-transparent dark:border-gray-600 rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none focus:outline-none transition-all text-sm placeholder-gray-500 dark:placeholder-gray-400"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none focus:outline-none transition-all text-sm placeholder-gray-500 dark:placeholder-gray-400"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">Password</label>
            <div className="flex-1">
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none focus:outline-none transition-all text-sm placeholder-gray-500 dark:placeholder-gray-400"
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
              {passwordFocused && mode === "signup" && (
                <div className="mt-2 space-y-1">
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
          </div>

          {/* Forgot Password Link - Only show for login */}
          {mode === "login" && (
            <div className="flex items-center gap-3">
              <div className="w-28 shrink-0"></div>
              <div className="flex-1">
                <span
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 font-semibold cursor-pointer hover:underline"
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          )}

          {/* formError is shown below the Sign In / Create Account button */}

          {mode === "signup" && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 shrink-0">Confirm Password</label>
              <div className="flex-1">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-lg text-black dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none focus:outline-none transition-all text-sm placeholder-gray-500 dark:placeholder-gray-400 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onChange={handleChange}
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1">
                    <MdClose className="text-red-500" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {formError && (
            <div className="text-red-500 text-sm font-medium mt-3 text-center">
              {formError}
            </div>
          )}
        </form>
        )}

        {/* OAuth Buttons - Only show for login */}
        {mode === "login" && (
          <>
            <Divider />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleOAuth("google")}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
              >
                <FcGoogle className="text-lg" />
                <span className="text-black dark:text-white font-medium text-sm">Continue with Google</span>
              </button>
              <button
                onClick={() => handleOAuth("github")}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
              >
                <FaGithub className="text-lg" />
                <span className="font-medium text-sm">Continue with GitHub</span>
              </button>
            </div>
          </>
        )}

        {/* Switch */}
        <p className="text-center text-sm mt-5 text-gray-600">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span
              className="text-blue-400 font-semibold cursor-pointer hover:underline"
              onClick={handleModeSwitch}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${met ? "text-green-600" : "text-red-600"}`}>
      {met ? (
        <FaCheck className="text-green-600" />
      ) : (
        <MdClose className="text-red-600" />
      )}
      <span>{text}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center my-6">
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span className="px-4 text-sm text-gray-400 dark:text-gray-500">or</span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
