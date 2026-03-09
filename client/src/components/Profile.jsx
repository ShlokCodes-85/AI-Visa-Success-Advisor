import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCamera, FiUser, FiMail, FiCalendar } from "react-icons/fi";

const renderContent = (activeSection, user, photo, isUploading, onClose, handlePhotoChange, handleRemovePhoto, getUserInitial) => {
  switch(activeSection) {
    case "personal-data":
      return (
        <>
          <div className="py-6 border-b border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile picture</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-white">
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
        </>
      );
    case "help":
      return (
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Welcome to AI Visa Success Advisor! Our platform helps you navigate the visa application process with AI-powered guidance.</p>
              <ul className="space-y-2 ml-4 text-sm text-gray-600 dark:text-gray-300">
                <li className="list-disc">Create an account and complete your application form with detailed information</li>
                <li className="list-disc">Use our AI chatbot to get answers to your visa-related questions</li>
                <li className="list-disc">Receive personalized analysis of your visa application</li>
                <li className="list-disc">Track your application progress in real-time</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Q: How accurate is the visa assessment?</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">A: Our AI analyzes your application based on current visa requirements and provides probability estimates. However, final decisions rest with immigration authorities.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Q: Can I edit my application after submission?</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">A: Yes, you can edit your application information anytime. Changes are saved automatically.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Q: Is my data secure?</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">A: We use industry-standard encryption and security protocols to protect your personal information.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Need More Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Contact our support team at support@aiviasuccess.com or use the chat feature in the application for immediate assistance.</p>
            </div>
          </div>
        </div>
      );
    case "privacy":
      return (
        <div className="py-6 space-y-4">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Information We Collect</h4>
              <p>We collect information you provide directly, such as your name, email, phone number, and visa application details. We also automatically collect usage data and analytics.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. How We Use Your Data</h4>
              <ul className="list-disc ml-4 space-y-1">
                <li>To provide and improve our services</li>
                <li>To analyze your visa application</li>
                <li>To send you updates and notifications</li>
                <li>To personalize your experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Data Protection</h4>
              <p>Your data is encrypted during transmission and storage. We maintain strict access controls and regular security audits to ensure your information remains confidential.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Cookies and Tracking</h4>
              <p>We use cookies to enhance your browsing experience and track usage patterns. You can control cookie settings in your browser preferences.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. Third-Party Sharing</h4>
              <p>We do not sell your data. We may share information with trusted partners only when necessary to provide our services or comply with law.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6. Your Rights</h4>
              <p>You have the right to access, correct, or delete your personal data. Contact us to exercise these rights or submit a data access request.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">7. Updates to This Policy</h4>
              <p>We may update this privacy policy periodically. We will notify you of significant changes via email or app notification.</p>
            </div>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About AI Visa Success Advisor</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI Visa Success Advisor is a comprehensive platform designed to help aspiring immigrants navigate the complex visa application process with confidence and clarity.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">To democratize visa guidance by leveraging artificial intelligence to provide personalized, accurate, and accessible support to visa applicants worldwide.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
              <ul className="space-y-2 ml-4 text-sm text-gray-600 dark:text-gray-300">
                <li className="list-disc">AI-Powered Analysis: Get intelligent assessment of your visa application</li>
                <li className="list-disc">Chat Support: Ask questions and get instant responses from our AI assistant</li>
                <li className="list-disc">Form Analysis: Detailed review of your application documents</li>
                <li className="list-disc">Real-time Tracking: Monitor your application status</li>
                <li className="list-disc">Personalized Recommendations: Get tailored advice based on your profile</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Version Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Application Version: 1.0.0</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Last Updated: March 2026</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contact & Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Email: support@aiviasuccess.com</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Website: www.aiviasuccess.com</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Follow us on social media for updates and tips.</p>
            </div>
          </div>
        </div>
      );
    case "terms":
      return (
        <div className="py-6 space-y-4">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Agreement to Terms</h4>
              <p>By accessing and using AI Visa Success Advisor, you agree to be bound by these terms and conditions. If you disagree with any part, please discontinue use.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Use License</h4>
              <p>We grant you a limited, non-exclusive, revocable license to use this platform for personal, non-commercial purposes. You agree not to:</p>
              <ul className="list-disc ml-4 space-y-1 mt-2">
                <li>Reproduce, duplicate, or copy content for commercial purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Transmit viruses or malicious code</li>
                <li>Engage in fraudulent activities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Disclaimer of Warranties</h4>
              <p>The service is provided "as is" without warranties. While we strive for accuracy, we cannot guarantee the visa assessment results. Immigration decisions depend on officials' discretion.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Limitation of Liability</h4>
              <p>We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform or inability to use it.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5. User Conduct</h4>
              <p>You agree to use the platform responsibly and provide accurate information. Misuse may result in account suspension or legal action.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6. Intellectual Property</h4>
              <p>All content, features, and functionality are owned by AI Visa Success Advisor or its content providers and are protected by copyright.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">7. Modification of Terms</h4>
              <p>We reserve the right to modify these terms at any time. Continued use of the platform signifies acceptance of updated terms.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">8. Governing Law</h4>
              <p>These terms are governed by applicable laws. Any disputes shall be resolved through appropriate legal channels.</p>
            </div>
          </div>
        </div>
      );
    case "security":
      return (
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Password Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Keep your account secure by using a strong password with a mix of uppercase, lowercase, numbers, and special characters.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Enable two-factor authentication for additional security. This requires a verification code along with your password for login.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Active Sessions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Review your active sessions regularly and log out from devices you no longer use.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security Tips</h4>
              <ul className="space-y-2 ml-4 text-sm text-gray-600 dark:text-gray-300">
                <li className="list-disc">Change your password regularly (every 3 months)</li>
                <li className="list-disc">Never share your password with anyone</li>
                <li className="list-disc">Use unique passwords for different accounts</li>
                <li className="list-disc">Be cautious of phishing emails</li>
                <li className="list-disc">Keep your device software updated</li>
                <li className="list-disc">Use secure Wi-Fi when accessing your account</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account Recovery</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">If you suspect unauthorized access, immediately change your password and contact our support team.</p>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const headerTitles = {
  "personal-data": { title: "Personal data", desc: "Real-time information and activities of your profile." },
  "security": { title: "Account Security", desc: "Manage your account security settings and passwords." },
  "help": { title: "Help Center", desc: "Get support and answers to common questions." },
  "privacy": { title: "Privacy & Policy", desc: "Understand how we collect and protect your data." },
  "about": { title: "About App", desc: "Learn more about our application and features." },
  "terms": { title: "Terms & Conditions", desc: "Review our terms and conditions of service." },
};

export default function Profile({ user, onClose, onPhotoChange }) {
  const [activeSection, setActiveSection] = useState("personal-data");
  
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
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-gray-900/50 overflow-y-auto max-h-[85vh]"
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
                  {["personal-data", "security"].map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === section
                          ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {section === "personal-data" ? "Personal Data" : "Account Security"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">General</p>
                <div className="mt-3 space-y-2">
                  {["help", "privacy", "about", "terms"].map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === section
                          ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {section === "help"
                        ? "Help Center"
                        : section === "privacy"
                        ? "Privacy & Policy"
                        : section === "about"
                        ? "About App"
                        : "Terms & Conditions"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="p-5 w-full">
            <div className="lg:hidden pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 overflow-x-auto">
                {["personal-data", "security", "help", "privacy", "about", "terms"].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === section
                        ? "bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {section === "personal-data"
                      ? "Personal Data"
                      : section === "security"
                      ? "Security"
                      : section === "help"
                      ? "Help"
                      : section === "privacy"
                      ? "Privacy"
                      : section === "about"
                      ? "About"
                      : "Terms"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {headerTitles[activeSection]?.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {headerTitles[activeSection]?.desc}
              </p>
            </div>

            <div className="w-full">
              {renderContent(activeSection, user, photo, isUploading, onClose, handlePhotoChange, handleRemovePhoto, getUserInitial)}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}