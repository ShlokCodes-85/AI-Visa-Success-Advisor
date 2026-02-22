import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import ThemeToggle from "./ThemeToggle";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const sections = ['features', 'how-it-works', 'testimonials', 'faq'];

  const handleNavClick = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      // Detect active section
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when menu or auth modal is open
  useEffect(() => {
    if (showMenu || showAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMenu, showAuth]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-center w-full bg-transparent transition-all duration-300">
        <div className={`flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ${
          isScrolled 
            ? 'rounded-full w-[85%] sm:w-[87%] lg:w-[90%]' 
            : 'rounded-none w-full'
        }`}>
        {/* Mobile menu button - LEFT SIDE */}
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="md:hidden p-2 rounded-lg transition-colors mr-2"
          aria-label="Toggle menu"
        >
          {showMenu ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="navbar-brand-font text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">
          Advisa
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-base lg:text-xl font-semibold">
          <a href="#features" className={`whitespace-nowrap pb-1 border-b-2 transition-all duration-200 ${
            activeSection === 'features' 
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
              : 'text-black dark:text-gray-100 border-transparent'
          }`}>
            Features
          </a>
          <a href="#how-it-works" className={`whitespace-nowrap pb-1 border-b-2 transition-all duration-200 ${
            activeSection === 'how-it-works' 
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
              : 'text-black dark:text-gray-100 border-transparent'
          }`}>
            How It Works
          </a>
          <a href="#testimonials" className={`whitespace-nowrap pb-1 border-b-2 transition-all duration-200 ${
            activeSection === 'testimonials' 
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
              : 'text-black dark:text-gray-100 border-transparent'
          }`}>
            Testimonials
          </a>
          <a href="#faq" className={`whitespace-nowrap pb-1 border-b-2 transition-all duration-200 ${
            activeSection === 'faq' 
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
              : 'text-black dark:text-gray-100 border-transparent'
          }`}>
            FAQ
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-3 lg:gap-4 items-center">
          <ThemeToggle variant="default" />
          <button 
            onClick={() => setShowAuth(true)}
            className="px-3 lg:px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-blue-600 dark:border-blue-700 text-white rounded-lg whitespace-nowrap font-medium text-sm lg:text-base">
            Get Started
          </button>
        </div>

        {/* Mobile actions visible on all sizes */}
        <div className="md:hidden flex gap-2 items-center">
          <ThemeToggle variant="icon" />
        </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {showMenu && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowMenu(false)}
          />
          {/* Sidebar */}
          <div className="md:hidden fixed left-0 top-0 h-screen w-64 sm:w-72 bg-white shadow-xl z-40 animate-in slide-in-from-left-3">
            {/* Close button and header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="navbar-brand-font text-lg font-bold text-blue-600">
                Advisa
              </span>
              <button 
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-lg text-black"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col p-4 gap-1">
              <a 
                href="#features" 
                onClick={handleNavClick}
                className={`px-4 py-3 rounded-lg font-medium text-base border-l-4 transition-all duration-200 ${
                  activeSection === 'features'
                    ? 'text-blue-600 bg-blue-50 border-blue-600'
                    : 'text-black border-transparent'
                }`}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={handleNavClick}
                className={`px-4 py-3 rounded-lg font-medium text-base border-l-4 transition-all duration-200 ${
                  activeSection === 'how-it-works'
                    ? 'text-blue-600 bg-blue-50 border-blue-600'
                    : 'text-black border-transparent'
                }`}
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                onClick={handleNavClick}
                className={`px-4 py-3 rounded-lg font-medium text-base border-l-4 transition-all duration-200 ${
                  activeSection === 'testimonials'
                    ? 'text-blue-600 bg-blue-50 border-blue-600'
                    : 'text-black border-transparent'
                }`}
              >
                Testimonials
              </a>
              <a 
                href="#faq" 
                onClick={handleNavClick}
                className={`px-4 py-3 rounded-lg font-medium text-base border-l-4 transition-all duration-200 ${
                  activeSection === 'faq'
                    ? 'text-blue-600 bg-blue-50 border-blue-600'
                    : 'text-black border-transparent'
                }`}
              >
                FAQ
              </a>
            </div>

            {/* Get Started Button - Bottom of Sidebar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <button 
                onClick={() => {
                  setShowAuth(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 bg-blue-600 border border-blue-600 text-white rounded-lg font-medium text-base">
                Get Started
              </button>
            </div>
          </div>
        </>
      )}
      
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;
