
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, ComponentType } from 'react';
import { Package2, Car, Rocket, Bike, Shield, Ship, Bus, Train, Plane, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const ZRLogoComponent = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-xl tracking-tighter", className)}>ZR</span>
);

type LogoType = 'Default' | 'Car' | 'Rocket' | 'Bike' | 'Shield' | 'Ship' | 'Bus' | 'Train' | 'Plane' | 'Bot' | 'ZR';

interface LogoContextType {
  logo: LogoType;
  setLogo: (logo: LogoType) => void;
  LogoComponent: ComponentType<{ className?: string }>;
}

const logoMap: Record<LogoType, ComponentType<{ className?: string }>> = {
    Default: Package2,
    Car: Car,
    Rocket: Rocket,
    Bike: Bike,
    Shield: Shield,
    Ship: Ship,
    Bus: Bus,
    Train: Train,
    Plane: Plane,
    Bot: Bot,
    ZR: ZRLogoComponent,
};

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: ReactNode }) {
  const [logo, setLogo] = useState<LogoType>('ZR');
  const [LogoComponent, setLogoComponent] = useState<ComponentType<{ className?: string }>>(() => ZRLogoComponent);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLogo = localStorage.getItem('appLogo') as LogoType;
    if (storedLogo && logoMap[storedLogo]) {
      setLogo(storedLogo);
    }
    
    // Listen for changes in localStorage from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'appLogo' && event.newValue && logoMap[event.newValue as LogoType]) {
            setLogo(event.newValue as LogoType);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }

  }, []);

  useEffect(() => {
    if (logoMap[logo]) {
        setLogoComponent(() => logoMap[logo]);
    }
  }, [logo]);
  
  const handleSetLogo = (newLogo: LogoType) => {
    if (logoMap[newLogo]) {
        setLogo(newLogo);
        // Set item in localStorage to trigger change in other tabs
        localStorage.setItem('appLogo', newLogo);
    }
  };

  return (
    <LogoContext.Provider value={{ logo, setLogo: handleSetLogo, LogoComponent }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
}
