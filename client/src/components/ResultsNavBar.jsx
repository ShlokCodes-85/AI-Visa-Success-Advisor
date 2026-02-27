import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { VscAccount, VscSettingsGear } from "react-icons/vsc";
import Dock from "./Dock";

export default function ResultsNavBar({ onToggleSidebar, onCreateNew }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem("profilePhoto") || null;
  });
  const navigate = useNavigate();

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          if (data.user.profilePhoto) {
            setProfilePhoto(data.user.profilePhoto);
            localStorage.setItem("profilePhoto", data.user.profilePhoto);
          }
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
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.fullName && user.fullName.trim()) {
      return user.fullName.trim()[0].toUpperCase();
    }
    if (user.email && user.email.trim()) {
      return user.email.trim()[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePhoto");
    setShowProfileMenu(false);
    setUser(null);
    setProfilePhoto(null);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const normalizedPhoto =
    profilePhoto && profilePhoto !== "null" && profilePhoto !== "undefined"
      ? profilePhoto
      : null;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight select-none">
            advisa
          </h1>

          {/* Mobile Action Buttons */}
          <div className="lg:hidden flex items-center gap-2 mr-2">
            <button
              onClick={onToggleSidebar}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              View Analysis History
            </button>
            <button
              onClick={onCreateNew}
              className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              New Analysis
            </button>
          </div>

          {/* Profile icon */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold hover:bg-blue-600 dark:hover:bg-blue-700 transition-all overflow-hidden border-2 border-white dark:border-gray-800 flex-shrink-0"
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
              <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-lg shadow-none border-none bg-transparent py-2 z-50">
                <Dock
                  items={[
                    { icon: <VscAccount size={16} />, label: 'Profile', onClick: handleProfileClick },
                    { icon: <VscSettingsGear size={16} />, label: 'Settings', onClick: () => alert('Settings coming soon!') },
                    {
                      icon: (
                        <span className="flex items-center justify-center">
                          <span className="hidden dark:inline"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg></span>
                          <span className="dark:hidden"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg></span>
                        </span>
                      ),
                      label: 'Toggle Theme',
                      onClick: () => {
                        const mode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                        document.documentElement.classList.toggle('dark');
                        localStorage.setItem('themeMode', mode);
                      }
                    },
                    { icon: <FiLogOut size={16} />, label: 'Logout', onClick: handleLogout, color: 'red' },
                  ]}
                  panelHeight={54}
                  baseItemSize={38}
                />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
