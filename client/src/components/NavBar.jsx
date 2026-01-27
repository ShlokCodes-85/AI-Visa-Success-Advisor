import { useState } from "react";
import AuthModal from "./AuthModal";

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-2 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm w-full">
        <div className="font-bold text-2xl text-blue-600">
          AI Visa Success Advisor
        </div>

        <div className="flex items-center gap-8 text-xl font-semibold text-black">
          <a href="#features" className="text-black hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-black hover:text-blue-600 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-black hover:text-blue-600 transition-colors">
            Testimonials
          </a>
          <a href="#faq" className="text-black hover:text-blue-600 transition-colors">
            FAQ
          </a>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setShowAuth(true)}
            className="px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-white hover:text-blue-600">
            Get Started
          </button>
        </div>
      </nav>
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;
