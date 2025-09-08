
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type ThemeColor = 'theme-blue' | 'theme-green' | 'theme-orange' | 'theme-rose' | 'theme-violet' | 'theme-yellow' | 'theme-lime' | 'theme-cyan' | 'theme-pink' | 'theme-slate';

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (theme: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>('theme-lime');

  useEffect(() => {
    const storedTheme = localStorage.getItem('themeColor') as ThemeColor;
    if (storedTheme) {
      setThemeColor(storedTheme);
    }
    
    // Listen for changes in localStorage from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'themeColor' && event.newValue) {
            setThemeColor(event.newValue as ThemeColor);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    // Remove all theme classes before adding the new one
    const classesToRemove = ['theme-blue', 'theme-green', 'theme-orange', 'theme-rose', 'theme-violet', 'theme-yellow', 'theme-lime', 'theme-cyan', 'theme-pink', 'theme-slate'];
    document.body.classList.remove(...classesToRemove);
    document.body.classList.add(themeColor);
  }, [themeColor]);

  const handleSetThemeColor = (theme: ThemeColor) => {
    setThemeColor(theme);
    // Set item in localStorage to trigger change in other tabs
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
