
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, ComponentType } from 'react';
import { Package2, Car, Rocket, Bike, Shield, Ship, Bus, Train, Plane, Bot } from 'lucide-react';

type LogoType = 'Default' | 'Car' | 'Rocket' | 'Bike' | 'Shield' | 'Ship' | 'Bus' | 'Train' | 'Plane' | 'Bot';

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
};

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: ReactNode }) {
  const [logo, setLogo] = useState<LogoType>('Default');
  const [LogoComponent, setLogoComponent] = useState<ComponentType<{ className?: string }>>(() => Package2);

  useEffect(() => {
    const storedLogo = localStorage.getItem('appLogo') as LogoType;
    if (storedLogo && logoMap[storedLogo]) {
      setLogo(storedLogo);
      setLogoComponent(() => logoMap[storedLogo]);
    }
  }, []);

  const handleSetLogo = (newLogo: LogoType) => {
    if (logoMap[newLogo]) {
        setLogo(newLogo);
        localStorage.setItem('appLogo', newLogo);
        setLogoComponent(() => logoMap[newLogo]);
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

    