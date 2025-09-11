
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, ComponentType } from 'react';
import { Package2, Car, Rocket, Bike, Shield, Ship, Bus, Train, Plane, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

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

  useEffect(() => {
    const configRef = doc(db, 'configs', 'appConfig');
    
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        const configData = docSnap.data();
        const dbLogo = configData.logo as LogoType;
        if (dbLogo && logoMap[dbLogo]) {
          setLogo(dbLogo);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (logoMap[logo]) {
        setLogoComponent(() => logoMap[logo]);
    }
  }, [logo]);
  
  const handleSetLogo = async (newLogo: LogoType) => {
    if (logoMap[newLogo]) {
        setLogo(newLogo);
        const configRef = doc(db, 'configs', 'appConfig');
        try {
            await setDoc(configRef, { logo: newLogo }, { merge: true });
        } catch (error) {
            console.error("Error saving logo to Firestore:", error);
        }
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
