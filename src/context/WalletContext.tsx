
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';


interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(250); // Start with a default mock balance

  useEffect(() => {
    // In a real app, you would fetch this from your DB.
    // For now, we just use a static mock balance.
    if (user) {
        setBalance(250); 
    } else {
        setBalance(0);
    }
  }, [user]);

  const addFunds = useCallback(async (amount: number) => {
    // This function will just update the local state for now.
    setBalance(prev => prev + amount);
  }, []);

  return (
    <WalletContext.Provider value={{ balance, addFunds }}>
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
