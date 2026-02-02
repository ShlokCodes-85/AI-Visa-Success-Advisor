import { useState } from "react";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm w-full">
        <div className="navbar-brand-font text-2xl text-blue-600 dark:text-blue-400">
          Advisa
        </div>

        <div className="flex items-center gap-8 text-xl font-semibold text-black dark:text-gray-100">
          <a href="#features" className="text-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Testimonials
          </a>
          <a href="#faq" className="text-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            FAQ
          </a>
        </div>

        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <button 
            onClick={() => setShowAuth(true)}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-blue-600 dark:border-blue-700 text-white rounded-lg hover:bg-white hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition-colors">
            Get Started
          </button>
        </div>
      </nav>
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;
