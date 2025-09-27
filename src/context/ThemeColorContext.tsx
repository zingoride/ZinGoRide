
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

type ThemeColor = 'theme-blue' | 'theme-green' | 'theme-orange' | 'theme-rose' | 'theme-violet' | 'theme-yellow' | 'theme-lime' | 'theme-cyan' | 'theme-pink' | 'theme-slate';

const ALL_THEME_CLASSES: ThemeColor[] = ['theme-blue', 'theme-green', 'theme-orange', 'theme-rose', 'theme-violet', 'theme-yellow', 'theme-lime', 'theme-cyan', 'theme-pink', 'theme-slate'];


interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (theme: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>('theme-lime');

  useEffect(() => {
    const configRef = doc(db, 'configs', 'appConfig');
    
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        const configData = docSnap.data();
        const dbTheme = configData.themeColor as ThemeColor;
        if (dbTheme && ALL_THEME_CLASSES.includes(dbTheme)) {
          setThemeColor(dbTheme);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Ensure this runs only client-side
    if (typeof window !== 'undefined') {
        document.body.classList.remove(...ALL_THEME_CLASSES);
        document.body.classList.add(themeColor);
    }
  }, [themeColor]);

  const handleSetThemeColor = async (theme: ThemeColor) => {
    if (ALL_THEME_CLASSES.includes(theme)) {
      // Optimistically update UI
      setThemeColor(theme);
      if (typeof window !== 'undefined') {
        document.body.classList.remove(...ALL_THEME_CLASSES);
        document.body.classList.add(theme);
      }
      
      // Save to Firestore
      const configRef = doc(db, 'configs', 'appConfig');
      try {
        await setDoc(configRef, { themeColor: theme }, { merge: true });
      } catch (error) {
        console.error("Error saving theme color to Firestore:", error);
      }
    }
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
