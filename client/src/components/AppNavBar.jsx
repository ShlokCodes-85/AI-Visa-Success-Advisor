import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiEdit, FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import Profile from "./Profile";

export default function AppNavBar({ mode, setMode }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    // Initialize state from localStorage
    return localStorage.getItem("profilePhoto") || null;
  });
  const navigate = useNavigate();

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      console.log("Token found:", !!token);
      if (!token) {
        console.log("No token, skipping user fetch");
        return;
      }

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("Auth response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("User data received:", data);
          setUser(data.user);
          
          // Set profile photo from user data if available
          if (data.user.profilePhoto) {
            setProfilePhoto(data.user.profilePhoto);
            // Also save to localStorage for quick access
            localStorage.setItem("profilePhoto", data.user.profilePhoto);
          }
          console.log("User set to:", data.user);
        } else {
          console.error("Failed to fetch user info, status:", response.status);
          const errorData = await response.text();
          console.error("Error response:", errorData);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Listen for profile photo changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedPhoto = localStorage.getItem("profilePhoto");
      setProfilePhoto(savedPhoto);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check for changes when window regains focus
    const handleFocus = () => {
      const savedPhoto = localStorage.getItem("profilePhoto");
      setProfilePhoto(savedPhoto);
    };
    
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    console.log("getUserInitials called, user:", user);
    
    if (!user) {
      console.log("No user, returning U");
      return "U";
    }
    
    // Try to get from fullName first
    if (user.fullName && user.fullName.trim()) {
      const initial = user.fullName.trim()[0].toUpperCase();
      console.log("Got initial from fullName:", initial);
      return initial;
    }
    
    // Try to get from email
    if (user.email && user.email.trim()) {
      const initial = user.email.trim()[0].toUpperCase();
      console.log("Got initial from email:", initial);
      return initial;
    }
    
    console.log("No user data found, returning U");
    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePhoto");
    setShowProfileMenu(false);
    setShowProfileModal(false);
    setUser(null);
    setProfilePhoto(null);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowProfileMenu(false);
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    // Refresh profile photo in case it was updated
    const savedPhoto = localStorage.getItem("profilePhoto");
    setProfilePhoto(savedPhoto);
  };

  const normalizedPhoto =
    profilePhoto && profilePhoto !== "null" && profilePhoto !== "undefined"
      ? profilePhoto
      : null;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center text-white hover:text-white dark:hover:text-white font-bold text-sm sm:text-base flex-shrink-0">
            ✓
          </div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
            AI Visa Success Advisor
          </h1>
        </div>

        {/* MODE TOGGLE BUTTON */}
        <div className="order-3 sm:order-none w-full sm:w-auto">
          <button
            onClick={() => setMode(mode === "form" ? "chat" : "form")}
            className="flex items-center gap-0 rounded-full bg-white dark:bg-gray-700 border border-transparent dark:border-gray-600 focus:outline-none w-full sm:w-auto"
          >
            <div
              className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-medium text-xs sm:text-sm rounded-full flex-1 sm:flex-none ${
                mode === "form" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700 text-black dark:text-gray-100"
              }`}
            >
              <FiEdit className="text-sm sm:text-lg flex-shrink-0" />
              <span className="hidden xs:inline">Form Mode</span>
              <span className="inline xs:hidden">Form</span>
            </div>
            <div
              className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-medium text-xs sm:text-sm rounded-full flex-1 sm:flex-none ${
                mode === "chat" ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700 text-black dark:text-gray-100"
              }`}
            >
              <FiMessageCircle className="text-sm sm:text-lg flex-shrink-0" />
              <span className="hidden xs:inline">Chat Mode</span>
              <span className="inline xs:hidden">Chat</span>
            </div>
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold hover:bg-blue-600 dark:hover:bg-blue-700 transition-all overflow-hidden border-2 border-white dark:border-gray-800 flex-shrink-0"
              style={
                normalizedPhoto
                  ? {
                      backgroundImage: `url(${normalizedPhoto})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
              title={user ? user.email : "User Profile"}
              aria-label="User profile menu"
            >
              {!normalizedPhoto && getUserInitials()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 py-2 z-50">
                {/* User Info Section */}
                {user && (
                  <>
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </>
                )}
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[auto]"
                >
                  <FiUser size={16} />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[auto]">
                  <FiSettings size={16} />
                  Settings
                </button>
                <ThemeToggle variant="menu" />
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-[auto]"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <Profile
          user={user}
          onClose={handleProfileModalClose}
          onPhotoChange={setProfilePhoto}
        />
      )}
    </header>
  );
}