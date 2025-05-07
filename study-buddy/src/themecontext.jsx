import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('blue');

  const themeColors = {
    blue: {
      gradient: 'from-blue-500 to-purple-500',
      hover: 'hover:from-blue-600 hover:to-purple-600',
      border: 'border-blue-500',
      text: 'text-blue-600',
      bg: 'from-blue-50 via-purple-50 to-pink-50'
    },
    green: {
      gradient: 'from-green-500 to-teal-500',
      hover: 'hover:from-green-600 hover:to-teal-600',
      border: 'border-green-500',
      text: 'text-green-600',
      bg: 'from-green-50 via-teal-50 to-blue-50'
    },
    amber: {
      gradient: 'from-amber-500 to-orange-500',
      hover: 'hover:from-amber-600 hover:to-orange-600',
      border: 'border-amber-500',
      text: 'text-amber-600',
      bg: 'from-amber-50 via-orange-50 to-yellow-50'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      hover: 'hover:from-purple-600 hover:to-pink-600',
      border: 'border-purple-500',
      text: 'text-purple-600',
      bg: 'from-purple-50 via-pink-50 to-indigo-50'
    }
  };

  const changeTheme = () => {
    const themes = Object.keys(themeColors);
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ changeTheme, theme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}