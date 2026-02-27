import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(() => localStorage.getItem("profilePhoto"));
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

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
            setPhoto(data.user.profilePhoto);
            localStorage.setItem("profilePhoto", data.user.profilePhoto);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setPhoto(base64String);
        
        // Save to localStorage for immediate display
        localStorage.setItem("profilePhoto", base64String);
        
        // Save to backend
        try {
          const token = localStorage.getItem("token");
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
          const response = await fetch(`${BACKEND_URL}/api/auth/profile-photo`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ profilePhoto: base64String }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error("Failed to save profile photo:", error);
            alert("Failed to save profile photo to server");
          } else {
            console.log("Profile photo saved successfully");
          }
        } catch (error) {
          console.error("Error saving profile photo:", error);
          alert("Error saving profile photo");
        }
        
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Failed to read image file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    setPhoto(null);
    localStorage.removeItem("profilePhoto");
    
    // Remove from backend
    try {
      const token = localStorage.getItem("token");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/auth/profile-photo`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to remove profile photo:", error);
        alert("Failed to remove profile photo from server");
      } else {
        console.log("Profile photo removed successfully");
      }
    } catch (error) {
      console.error("Error removing profile photo:", error);
      alert("Error removing profile photo");
    }
  };

  const getUserInitial = () => {
    if (!user) return "U";
    if (user.fullName) return user.fullName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Go back"
          >
            <IoArrowBack className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="hidden lg:block border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-5">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Personal Info</p>
                  <div className="mt-3 space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      Personal Data
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      Account Security
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">General</p>
                  <div className="mt-3 space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      Help Center
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      Privacy & Policy
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      About App
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      Terms & Conditions
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="p-5">
              <div className="lg:hidden pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button className="whitespace-nowrap px-3 py-2 rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 text-sm font-medium">
                    Personal Data
                  </button>
                  <button className="whitespace-nowrap px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    Account Security
                  </button>
                  <button className="whitespace-nowrap px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    Help Center
                  </button>
                  <button className="whitespace-nowrap px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    Privacy & Policy
                  </button>
                </div>
              </div>

              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time information and activities of your profile.</p>
              </div>

              <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile picture</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {photo ? (
                        <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {getUserInitial()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Profile picture</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG under 5MB</p>
                      {isUploading && (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                          <p className="text-xs text-blue-500 dark:text-blue-400">Uploading...</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="photo-upload"
                      className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer"
                    >
                      Upload new picture
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <button
                      onClick={handleRemovePhoto}
                      disabled={!photo || isUploading}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">First name</label>
                    <input
                      type="text"
                      defaultValue={user?.fullName ? user.fullName.split(" ")[0] : ""}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last name</label>
                    <input
                      type="text"
                      defaultValue={user?.fullName ? user.fullName.split(" ").slice(1).join(" ") : ""}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contact email</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Allows for accurate identification and communication with you.</p>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  className="w-full sm:w-80 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                  readOnly
                />
              </div>

              <div className="py-6">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Phone number</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">The phone number helps us identify and communicate with you.</p>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone number</label>
                <input
                  type="text"
                  defaultValue={user?.phoneNumber || ""}
                  className="w-full sm:w-80 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                  readOnly
                />
              </div>

              <button
                onClick={() => navigate(-1)}
                className="mt-2 px-6 py-2 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
              >
                Done
              </button>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
