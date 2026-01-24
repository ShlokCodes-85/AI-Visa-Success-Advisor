import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000"; // change in prod

export default function AuthModal({ onClose }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordValidation = {
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(formData.password),
    isLengthValid: formData.password.length >= 8 && formData.password.length <= 15,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModeSwitch = () => {
    setMode(mode === "login" ? "signup" : "login");
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setPasswordFocused(false);
  };

  const handleOAuth = (provider) => {
    window.location.href = `${BACKEND_URL}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint =
      mode === "login" ? "/auth/login" : "/auth/register";

    const body = mode === "login" 
      ? { email: formData.email, password: formData.password }
      : { fullName: formData.fullName, username: formData.username, email: formData.email, password: formData.password };

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
      alert(data.message || "Authentication failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full ${mode === "signup" ? "max-w-[450px]" : "max-w-[400px]"} bg-white rounded-2xl p-6 shadow-2xl relative transform transition-all`}>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 bg-white border border-transparent rounded hover:border-black transition-all"
        >
          <IoClose className="text-lg text-black" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          {mode === "login" ? "Welcome Back!" : "Create Account"}
        </h2>
        <p className="text-gray-500 text-center mb-5">
          {mode === "login" ? "Sign in to continue your visa journey" : "Start your visa success journey today"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  placeholder="Enter your full name"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  placeholder="Enter your username"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Password</label>
            <div className="flex-1">
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
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

          {mode === "signup" && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-28 shrink-0">Confirm Password</label>
              <div className="flex-1">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
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
        </form>

        {/* OAuth Buttons - Only show for login */}
        {mode === "login" && (
          <>
            <Divider />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleOAuth("google")}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-white border border-gray-400 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
              >
                <FcGoogle className="text-lg" />
                <span className="text-black font-medium text-sm">Continue with Google</span>
              </button>
              <button
                onClick={() => handleOAuth("github")}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
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
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
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
      <div className="flex-1 h-px bg-gray-200" />
      <span className="px-4 text-sm text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
