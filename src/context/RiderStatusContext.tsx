'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type RiderStatusContextType = {
  isOnline: boolean;
  toggleStatus: () => void;
};

const RiderStatusContext = createContext<RiderStatusContextType | undefined>(undefined);

export function RiderStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);

  const toggleStatus = () => {
    setIsOnline(prev => !prev);
  };

  return (
    <RiderStatusContext.Provider value={{ isOnline, toggleStatus }}>
      {children}
    </RiderStatusContext.Provider>
  );
}

export function useRiderStatus() {
  const context = useContext(RiderStatusContext);
  if (context === undefined) {
    throw new Error('useRiderStatus must be used within a RiderStatusProvider');
  }
  return context;
}
