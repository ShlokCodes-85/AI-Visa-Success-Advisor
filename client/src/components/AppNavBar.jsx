import { useState } from "react";
import { FiMessageCircle, FiEdit, FiSettings, FiLogOut, FiUser } from "react-icons/fi";

export default function AppNavBar({ mode, setMode }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <h1 className="text-xl font-bold text-gray-900">AI Visa Success Advisor</h1>
        </div>

        {/* MODE TOGGLE BUTTON */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setMode(mode === "form" ? "chat" : "form")}
            className="flex items-center gap-0 rounded-full bg-white border border-gray-300 focus:outline-none"
          >
            <div
              className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-full ${
                mode === "form" ? "bg-blue-500 text-white" : "bg-white text-black"
              }`}
            >
              <FiEdit className="text-lg" />
              Form Mode
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-full ${
                mode === "chat" ? "bg-blue-500 text-white" : "bg-white text-black"
              }`}
            >
              <FiMessageCircle className="text-lg" />
              Chat Mode
            </div>
          </button>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold hover:bg-blue-600 transition-all"
          >
            JD
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button className="w-full flex items-center gap-3 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50">
                <FiUser />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50">
                <FiSettings />
                Settings
              </button>
              <hr className="my-1 border-gray-200" />
              <button className="w-full flex items-center gap-3 px-4 py-2 bg-white text-red-600 hover:bg-red-50">
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
