
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => Promise<void>; // This might not be needed on client
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

  const addFunds = useCallback(async (amount: number) => {
    // This is now mainly handled by the admin panel or cloud functions for security.
    // This local update is just for immediate UI feedback if needed, but the source of truth is Firestore.
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const currentBalance = docSnap.data().walletBalance || 0;
            setBalance(currentBalance + amount); // Optimistic update
        }
    }
  }, [user]);

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
