'use client';

import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';

export const ThemeContext = createContext({
  theme: '',
  isClient: false,
  toggleTheme: () => {},
  setIsClient: (_x: boolean) => {},
});

function ThemeProvider({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState(global.window?.__theme || 'light');

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
    setIsClient(true);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isClient, theme, setIsClient, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
