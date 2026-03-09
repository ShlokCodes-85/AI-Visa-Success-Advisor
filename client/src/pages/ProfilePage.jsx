import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(() => localStorage.getItem("profilePhoto"));
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal-data");
  const [passwordModals, setPasswordModals] = useState({
    changePassword: false,
    addPassword: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

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
          
          // Use profilePhoto (manual) or avatar (OAuth) as fallback
          const photoToUse = data.user.profilePhoto || data.user.avatar;
          if (photoToUse) {
            setPhoto(photoToUse);
            localStorage.setItem("profilePhoto", photoToUse);
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

  const handleOpenPasswordModal = (modalType) => {
    setPasswordModals(prev => ({ ...prev, [modalType]: true }));
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleClosePasswordModal = (modalType) => {
    setPasswordModals(prev => ({ ...prev, [modalType]: false }));
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password changed successfully!");
        setTimeout(() => {
          handleClosePasswordModal("changePassword");
        }, 1500);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Error changing password. Please try again.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Both password fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/auth/add-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password added successfully! You can now sign in with email and password.");
        setTimeout(() => {
          handleClosePasswordModal("addPassword");
        }, 1500);
      } else {
        setPasswordError(data.message || "Failed to add password");
        if (data.errors) {
          setPasswordError(data.errors.join(", "));
        }
      }
    } catch (error) {
      console.error("Error adding password:", error);
      setPasswordError("Error adding password. Please try again.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const renderSectionTitle = () => {
    const titles = {
      "personal-data": "Personal data",
      "account-security": "Account Security",
      "privacy-policy": "Privacy & Policy",
      "about-app": "About App",
      "terms-conditions": "Terms & Conditions"
    };
    return titles[activeSection] || "Personal data";
  };

  const renderSectionDescription = () => {
    const descriptions = {
      "personal-data": "Real-time information and activities of your profile.",
      "account-security": "Manage your account security settings and credentials.",
      "privacy-policy": "Learn how we collect, use, and protect your personal information.",
      "about-app": "Information about the Visa Success Advisor application.",
      "terms-conditions": "Review the complete terms and conditions for using our service."
    };
    return descriptions[activeSection] || "Real-time information and activities of your profile.";
  };

  const renderSectionContent = () => {
    switch(activeSection) {
      case "personal-data":
        return (
          <>
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
                className="w-full sm:w-80 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                readOnly
                disabled
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
          </>
        );
      
      case "account-security":
        return (
          <div className="py-6">
            <div className="space-y-6">
              {/* Email Section */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Email Address</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your login email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
              </div>

              {/* Password Section */}
              {user?.authProvider === "local" ? (
                // Email/Password Users - Show password and change option
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Password</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">Secure your account with a strong password.</p>
                      <p className="text-sm font-mono text-blue-900 dark:text-blue-300 tracking-widest">••••••••</p>
                    </div>
                    <button 
                      onClick={() => handleOpenPasswordModal("changePassword")}
                      className="ml-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all whitespace-nowrap"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                // OAuth Users - Show add password option
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900 dark:text-amber-300 mb-2">Password</h4>
                      <p className="text-sm text-amber-800 dark:text-amber-400">No password set. You can add one to enable email/password sign in.</p>
                    </div>
                    <button 
                      onClick={() => handleOpenPasswordModal("addPassword")}
                      className="ml-4 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-all whitespace-nowrap"
                    >
                      Add Password
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Add an extra layer of security to your account.</p>
                <button className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-all">
                  Enable 2FA
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Active Sessions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage your active login sessions.</p>
                <button className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-all">
                  View Sessions
                </button>
              </div>
            </div>

            {/* Change Password Modal */}
            {passwordModals.changePassword && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{passwordError}</p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">{passwordSuccess}</p>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Must contain 8-15 characters, 1 uppercase, 1 lowercase, 1 special character
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => handleClosePasswordModal("changePassword")}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingPassword}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium transition-all"
                      >
                        {isSubmittingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Password Modal */}
            {passwordModals.addPassword && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Password</h3>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{passwordError}</p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">{passwordSuccess}</p>
                    </div>
                  )}

                  <form onSubmit={handleAddPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Must contain 8-15 characters, 1 uppercase, 1 lowercase, 1 special character
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordFormChange}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm password"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => handleClosePasswordModal("addPassword")}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingPassword}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium transition-all"
                      >
                        {isSubmittingPassword ? "Adding..." : "Add Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      
      case "privacy-policy":
        return (
          <div className="py-6 space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Information We Collect</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We collect personal information you provide directly, including your name, email address, contact number, and visa application details. This information is essential for analyzing your visa application and providing personalized recommendations.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. How We Use Your Information</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-3">
                  <li>Analyze your visa application and provide AI-driven insights</li>
                  <li>Generate personalized improvement recommendations</li>
                  <li>Improve our services and user experience</li>
                  <li>Communicate important updates about your account</li>
                  <li>Ensure compliance with legal and regulatory requirements</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Data Security & Protection</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We implement industry-leading security measures including encryption, secure servers, and regular security audits to protect your personal information. Your data is stored securely and is never accessed without proper authorization.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Third-Party Sharing</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We do not sell, rent, or share your personal information with third parties except when required by law. We do not use your data for marketing purposes without explicit consent.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Your Rights</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  You have the right to access, modify, or request deletion of your personal information at any time. Please contact our privacy team to exercise these rights.
                </p>
              </div>
            </div>
          </div>
        );
      
      case "about-app":
        return (
          <div className="py-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Visa Success Advisor</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your intelligent companion for visa application success. Our AI-powered platform analyzes your application and provides personalized recommendations to maximize your visa approval chances.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Version</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.0.0</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• AI-powered visa success prediction</li>
                  <li>• Personalized improvement recommendations</li>
                  <li>• Real-time form analysis</li>
                  <li>• Multi-destination support</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case "terms-conditions":
        return (
          <div className="py-6 space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  By accessing and using the Visa Success Advisor application, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree to any part of these terms, you must discontinue use of the service immediately.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Service Description & Limitations</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Visa Success Advisor provides AI-powered analysis and recommendations for visa applications. Our service is provided "as-is" for informational purposes only. We do not guarantee visa approval or provide legal advice. Visa decisions are made solely by immigration authorities based on their criteria and requirements.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Our recommendations are based on general visa guidelines and past patterns, not binding legal opinions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. User Responsibilities</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Provide accurate and honest information in your application</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the service in compliance with all applicable laws</li>
                  <li>Not submit false, misleading, or fraudulent information</li>
                  <li>Not attempt to harm, disable, or overload our servers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Intellectual Property</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  All content, features, and functionality of the Visa Success Advisor application are owned by us, our licensors, or other providers of such material and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Limitation of Liability</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  In no event shall Visa Success Advisor be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including but not limited to visa denial or any immigration-related consequences.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6. Disclaimer of Warranties</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  The service is provided without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the service will be uninterrupted or error-free.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">7. Modification of Terms</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes your acceptance of the updated terms.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">8. Governing Law</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  These terms and conditions are governed by applicable international laws and regulations. Any disputes arising from the use of this service shall be resolved through appropriate legal channels.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
                    <button 
                      onClick={() => setActiveSection("personal-data")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === "personal-data"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Personal Data
                    </button>
                    <button 
                      onClick={() => setActiveSection("account-security")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === "account-security"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Account Security
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">General</p>
                  <div className="mt-3 space-y-2">
                    <button 
                      onClick={() => setActiveSection("privacy-policy")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === "privacy-policy"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Privacy & Policy
                    </button>
                    <button 
                      onClick={() => setActiveSection("about-app")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === "about-app"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      About App
                    </button>
                    <button 
                      onClick={() => setActiveSection("terms-conditions")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === "terms-conditions"
                          ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Terms & Conditions
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="p-5">
              {/* Mobile tabs */}
              <div className="lg:hidden pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <button 
                    onClick={() => setActiveSection("personal-data")}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === "personal-data"
                        ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Personal Data
                  </button>
                  <button 
                    onClick={() => setActiveSection("account-security")}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === "account-security"
                        ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Account Security
                  </button>
                  <button 
                    onClick={() => setActiveSection("privacy-policy")}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === "privacy-policy"
                        ? "bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    Privacy & Policy
                  </button>
                </div>
              </div>

              {/* Section header */}
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{renderSectionTitle()}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{renderSectionDescription()}</p>
              </div>

              {/* Section content */}
              {renderSectionContent()}

              <button
                onClick={() => navigate(-1)}
                className="mt-6 px-6 py-2 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
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
