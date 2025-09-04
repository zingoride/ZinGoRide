
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface WalletContextType {
  balance: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0); 

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setBalance(doc.data().walletBalance || 0);
        }
      });

      return () => unsubscribe();
    } else {
      setBalance(0);
    }
  }, [user]);

  return (
    <WalletContext.Provider value={{ balance }}>
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
