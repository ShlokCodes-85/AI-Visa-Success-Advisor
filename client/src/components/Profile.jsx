import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCamera, FiUser, FiMail, FiCalendar } from "react-icons/fi";

export default function Profile({ user, onClose, onPhotoChange }) {
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl dark:shadow-gray-900/50 relative flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-5">Profile</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">User information is not available.</p>
          <button
            onClick={onClose}
            className="w-full mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  const [photo, setPhoto] = useState(() => localStorage.getItem("profilePhoto"));
  const [isUploading, setIsUploading] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
        if (onPhotoChange) onPhotoChange(base64String);
        
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
    if (onPhotoChange) onPhotoChange(null);
    
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-gray-900/50 overflow-y-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-600"></span>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Close profile"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 p-5">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Personal Info</p>
                <div className="mt-3 space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-sm font-medium">
                    Personal Data
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    Account Security
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">General</p>
                <div className="mt-3 space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    Help Center
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    Privacy & Policy
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    About App
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    Terms & Conditions
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="p-5">
            <div className="lg:hidden pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button className="whitespace-nowrap px-3 py-2 rounded-lg bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-sm font-medium">
                  Personal Data
                </button>
                <button className="whitespace-nowrap px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  Account Security
                </button>
                <button className="whitespace-nowrap px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  Help Center
                </button>
                <button className="whitespace-nowrap px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  Privacy & Policy
                </button>
              </div>
            </div>
            <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-time information and activities of your profile.</p>
            </div>

            <div className="py-6 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile picture</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
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
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
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
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">First name</label>
                  <input
                    type="text"
                    defaultValue={user?.fullName ? user.fullName.split(" ")[0] : ""}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last name</label>
                  <input
                    type="text"
                    defaultValue={user?.fullName ? user.fullName.split(" ").slice(1).join(" ") : ""}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contact email</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Allows for accurate identification and communication with you.</p>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full sm:w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
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
                className="w-full sm:w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                readOnly
              />
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
            >
              Save Changes
            </button>
          </main>
        </div>
      </div>
    </div>
  );
}