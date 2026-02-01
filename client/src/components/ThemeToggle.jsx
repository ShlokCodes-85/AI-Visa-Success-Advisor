import { useState, useRef, useEffect } from 'react';
import useTheme from '../contexts/ThemeContext';
import { ChevronDown } from 'lucide-react';

// Custom SVG Icons
const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

function ThemeToggle({ variant = 'default' }) {
  const { mode, isDark, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const modeOptions = [
    { key: 'light', label: 'Light Mode', icon: SunIcon },
    { key: 'system', label: 'System Mode', icon: SystemIcon },
    { key: 'dark', label: 'Dark Mode', icon: MoonIcon },
  ];

  const currentMode = modeOptions.find(opt => opt.key === mode);
  const CurrentIcon = currentMode?.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonBaseClasses =
    variant === 'menu'
      ? 'w-full px-4 py-2'
      : 'px-4 py-2 rounded-lg';

  const containerClasses = variant === 'menu' ? 'relative w-full' : 'relative';

  const labelClasses = variant === 'menu' ? 'inline text-sm' : 'hidden sm:inline';

  const buttonThemeClasses =
    variant === 'menu'
      ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
      : isDark
        ? 'bg-gray-900 text-white border border-gray-700 hover:bg-gray-800'
        : 'bg-gray-100 text-black border border-gray-300 hover:bg-gray-200';

  const dropdownAlignClasses = variant === 'menu' ? 'left-0 w-full' : 'right-0 w-48';

  return (
    <div className={containerClasses} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 font-medium transition-all ${buttonBaseClasses} ${buttonThemeClasses}`}
        title="Theme Options"
      >
        {CurrentIcon && <CurrentIcon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />}
        <span className={labelClasses}>{currentMode?.label}</span>
        <ChevronDown size={16} className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropdownAlignClasses} mt-2 rounded-lg shadow-lg border z-50 ${
            isDark
              ? 'bg-black border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {modeOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                key={option.key}
                onClick={() => {
                  setThemeMode(option.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isDark
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <OptionIcon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
