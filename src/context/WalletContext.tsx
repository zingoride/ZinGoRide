
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  // Set initial balance to 250 to test the minimum balance logic
  const [balance, setBalance] = useState(250); 

  const addFunds = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const deductFunds = (amount: number) => {
    setBalance(prev => (prev >= amount ? prev - amount : prev));
  };

  return (
    <WalletContext.Provider value={{ balance, addFunds, deductFunds }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
