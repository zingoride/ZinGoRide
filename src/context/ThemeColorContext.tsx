
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ThemeColor = 'theme-blue' | 'theme-green' | 'theme-orange' | 'theme-rose' | 'theme-violet' | 'theme-yellow' | 'theme-lime' | 'theme-cyan' | 'theme-pink' | 'theme-slate';

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (theme: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>('theme-blue');

  useEffect(() => {
    const storedTheme = localStorage.getItem('themeColor') as ThemeColor;
    if (storedTheme) {
      setThemeColor(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-rose', 'theme-violet', 'theme-yellow', 'theme-lime', 'theme-cyan', 'theme-pink', 'theme-slate');
    document.body.classList.add(themeColor);
  }, [themeColor]);

  const handleSetThemeColor = (theme: ThemeColor) => {
    setThemeColor(theme);
    localStorage.setItem('themeColor', theme);
  };

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor: handleSetThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error('useThemeColor must be used within a ThemeColorProvider');
  }
  return context;
}
