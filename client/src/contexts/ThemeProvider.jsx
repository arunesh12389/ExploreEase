import { createContext, useContext, useEffect, useState } from 'react';

// Removed type definitions
// type Theme = 'dark' | 'light';
// type ThemeProviderProps = {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
// };
// type ThemeProviderState = {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// };

// Removed explicit type on initialState
const initialState = {
  theme: 'light',
  setTheme: () => null,
};

// Removed generic type annotation on createContext
const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  ...props
}) {
  // Removed generic type annotation on useState and type assertion on localStorage.getItem
  const [theme, setTheme] = useState(
    () => (localStorage.getItem('theme') || defaultTheme)
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
