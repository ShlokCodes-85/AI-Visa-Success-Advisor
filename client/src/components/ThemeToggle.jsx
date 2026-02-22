import useTheme from '../contexts/ThemeContext';

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

function ThemeToggle({ variant = 'default' }) {
  const { isDark, setThemeMode } = useTheme();

  const handleToggle = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const CurrentIcon = isDark ? MoonIcon : SunIcon;

  const buttonClasses =
    variant === 'menu'
      ? 'w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
      : variant === 'icon'
      ? 'p-2 sm:p-2.5 lg:p-3 rounded-lg bg-gray-100 dark:bg-gray-900 text-black dark:text-white border border-transparent dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800'
      : 'px-3 lg:px-4 py-2 rounded-lg border border-transparent dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 whitespace-nowrap font-medium text-sm lg:text-base';

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center gap-2 transition-all focus:outline-none ${buttonClasses}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <CurrentIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-white' : 'text-black'}`} />
    </button>
  );
}

export default ThemeToggle;
