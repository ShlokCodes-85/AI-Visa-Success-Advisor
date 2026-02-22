import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      return savedMode;
    }
    return 'light';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Determine if dark mode is active based on mode and system preference
  const isDark = mode === 'dark' || (mode === 'system' && systemIsDark);

  // Update DOM and localStorage when mode changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('themeMode', mode);
  }, [mode, isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setThemeMode = (newMode) => {
    if (['light', 'dark', 'system'].includes(newMode)) {
      setMode(newMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default useTheme;
