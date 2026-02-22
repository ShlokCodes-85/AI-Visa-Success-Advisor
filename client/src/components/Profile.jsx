import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCamera, FiUser, FiMail, FiCalendar } from "react-icons/fi";

export default function Profile({ user, onClose, onPhotoChange }) {
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
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
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
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
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
        className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl dark:shadow-gray-900/50 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
        >
          <IoClose className="text-lg text-gray-700 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-5">
          My Profile
        </h2>

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-600 flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600 shadow-lg">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {getUserInitial()}
                </span>
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-lg border-2 border-white dark:border-gray-800"
              title="Upload photo"
            >
              <FiCamera className="text-white text-sm" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          {isUploading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
              <p className="text-xs text-blue-500 dark:text-blue-400">Uploading...</p>
            </div>
          )}
          {photo && !isUploading && (
            <button
              onClick={handleRemovePhoto}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors font-medium"
            >
              Remove Photo
            </button>
          )}
        </div>

        {/* User Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <FiUser className="text-blue-600 dark:text-blue-400 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Name</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user?.fullName || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <FiMail className="text-blue-600 dark:text-blue-400 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Email</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user?.email || "Not provided"}
              </p>
            </div>
          </div>



          <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <FiCalendar className="text-blue-600 dark:text-blue-400 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}