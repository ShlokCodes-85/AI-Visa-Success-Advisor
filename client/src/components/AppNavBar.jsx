
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiEdit, FiMessageCircle, FiPlus, FiEdit2, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { VscAccount, VscSettingsGear } from "react-icons/vsc";
import ThemeToggle from "./ThemeToggle";
import Profile from "./Profile";
import Dock from "./Dock";

export default function AppNavBar({ 
  mode, 
  setMode, 
  setCurrentSection, 
  currentSection, 
  completedSections = [],
  chats = [],
  setChats = () => {},
  activeChat = null,
  setActiveChat = () => {},
  editingId = null,
  setEditingId = () => {},
  editTitle = "",
  setEditTitle = () => {},
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

  const handleCreateNewChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to create a chat");
      return;
    }

    try {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (isLocalhost ? "http://localhost:5000" : "https://ai-visa-success-advisor.onrender.com");
      const response = await fetch(`${BACKEND_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `New Chat`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newChat = {
          id: data.chat.id,
          title: data.chat.title,
          createdAt: data.chat.createdAt,
        };
        setChats([newChat, ...chats]);
        setActiveChat(newChat.id);
        console.log("Chat created successfully:", newChat.id);
      } else {
        console.error("Failed to create chat:", response.status);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat");
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      confirmDeleteChat(chatId);
    }
  };

  const confirmDeleteChat = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete a chat");
      return;
    }

    try {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (isLocalhost ? "http://localhost:5000" : "https://ai-visa-success-advisor.onrender.com");
      const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);

        if (activeChat === chatId) {
          setActiveChat(null);
        }

        console.log("Chat deleted successfully");
      } else {
        console.error("Failed to delete chat:", response.status);
        alert("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };

  const handleEditChat = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to update chat title");
      return;
    }

    try {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (isLocalhost ? "http://localhost:5000" : "https://ai-visa-success-advisor.onrender.com");
      const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
        }),
      });

      if (response.ok) {
        setChats(
          chats.map((chat) =>
            chat.id === chatId ? { ...chat, title: editTitle } : chat
          )
        );
        setEditingId(null);
        setEditTitle("");
        console.log("Chat title updated successfully");
      } else {
        console.error("Failed to update chat title:", response.status);
        alert("Failed to update chat title");
      }
    } catch (error) {
      console.error("Error updating chat title:", error);
      alert("Failed to update chat title");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 relative">
        {/* Hamburger for mobile */}
        <button className="lg:hidden flex items-center justify-center p-2 rounded-lg bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <FiMenu className="w-6 h-6" />
        </button>
        {/* Title - on left for desktop, centered for mobile */}
        <h1 className="lg:flex-none text-center lg:text-left text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight select-none lg:w-auto">advisa</h1>
        {/* Segmented Mode Switch Button (Form/Chat) for desktop - centered */}
        <div className="hidden lg:flex flex-1 justify-center z-10">
          <div className="flex flex-row items-center gap-0 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => mode !== "form" && setMode("form")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all focus:outline-none
                ${mode === "form"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"}
              `}
              aria-label="Switch to Form Mode"
            >
              <FiEdit size={18} />
              <span>Form</span>
            </button>
            <button
              onClick={() => mode !== "chat" && setMode("chat")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all focus:outline-none
                ${mode === "chat"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"}
              `}
              aria-label="Switch to Chat Mode"
            >
              <FiMessageCircle size={18} />
              <span>Chat</span>
            </button>
          </div>
        </div>
        {/* Profile icon top right */}
        <div className="relative ml-auto">
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
    {/* Sidebar Drawer for mobile navigation */}
    {sidebarOpen && (
      <div className="fixed inset-0 z-50 flex flex-row lg:hidden">
        {/* Overlay */}
        <div className="bg-black/40 w-full h-full lg:hidden" onClick={() => setSidebarOpen(false)} />
        {/* Sidebar on the left, only on mobile */}
        <nav className="bg-white dark:bg-gray-900 w-64 max-w-full h-full shadow-lg p-6 flex flex-col gap-4 fixed left-0 top-0 z-50 lg:hidden">
          <button className="self-end mb-4 bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl font-light" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
          
          {/* Conditional Content: Form Sections or Chat Controls */}
          {mode === "form" ? (
            <>
              <span className="text-lg font-bold text-blue-600 mb-4">Sections</span>
              <a
                href="#personal-details"
                className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 1 ? 'font-bold text-blue-600' : ''}`}
                onClick={e => {
                  e.preventDefault();
                  setSidebarOpen(false);
                  setCurrentSection && setCurrentSection(1);
                }}
              >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(1) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Personal Details
                </a>
                <a
                  href="#education-background"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 2 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(2);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(2) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Education Background
                </a>
                <a
                  href="#intended-course"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 3 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(3);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(3) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Intended Course & University
                </a>
                <a
                  href="#exam-info"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 4 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(4);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(4) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Exam Information
                </a>
                <a
                  href="#financial-proof"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 5 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(5);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(5) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Financial Proof
                </a>
                <a
                  href="#home-country-ties"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 6 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(6);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(6) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Home Country Ties
                </a>
                <a
                  href="#statement-of-purpose"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 7 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(7);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(7) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Statement of Purpose (SOP)
                </a>
                <a
                  href="#interview-history"
                  className={`flex items-center gap-2 text-base text-gray-700 dark:text-gray-200 py-1 group ${currentSection === 8 ? 'font-bold text-blue-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                    setCurrentSection && setCurrentSection(8);
                  }}
                >
                  <span className={`inline-block w-2 h-2 rounded-full border-2 transition ${completedSections.includes(8) ? 'bg-blue-600 border-blue-600' : 'border-dotted border-gray-400 group-hover:border-blue-500'}`}></span>
                  Interview History
                </a>
            </>
          ) : (
            <>
              {/* Chat Controls */}
              <span className="text-lg font-bold text-blue-600 mb-2">Chats</span>
              <button
                onClick={() => {
                  handleCreateNewChat();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium shadow-sm text-sm min-h-[44px]"
              >
                <FiPlus className="text-base" />
                <span>New Chat</span>
              </button>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto space-y-1.5">
                {chats.length === 0 ? (
                  <div className="flex items-center justify-center h-32 px-4">
                    <div className="text-center">
                      <FiMessageSquare className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">No chats yet</p>
                    </div>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        setActiveChat(chat.id);
                        setSidebarOpen(false);
                      }}
                      className={`group relative p-2 rounded-lg cursor-pointer transition-all text-sm ${
                        activeChat === chat.id
                          ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }`}
                    >
                      {editingId === chat.id ? (
                        <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-2 py-1 text-xs border bg-white dark:bg-gray-700 text-black dark:text-gray-100 border-transparent dark:border-gray-600 rounded focus:outline-none focus:ring-2"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(chat.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleSaveEdit(chat.id)}
                              className="px-2 py-0.5 text-[11px] bg-blue-500 text-white rounded hover:bg-blue-600 min-h-[32px]"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-0.5 text-[11px] bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 min-h-[32px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 flex-1 text-xs sm:text-sm">
                            {chat.title}
                          </h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={(e) => handleEditChat(chat, e)}
                              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="Edit chat"
                            >
                              <FiEdit2 className="text-xs" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="bg-white dark:bg-gray-800 text-red-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                              title="Delete chat"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </nav>
        </div>
      )}
      {/* Profile Modal */}
      {showProfileModal && (
        <Profile
          user={user || { fullName: '', email: '', createdAt: '' }}
          onClose={handleProfileModalClose}
          onPhotoChange={setProfilePhoto}
        />
      )}
    </header>
  );
}