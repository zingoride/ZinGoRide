
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { RideRequest } from '@/lib/types';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export type RideDetails = RideRequest;

type RideContextType = {
  activeRide: RideDetails | null;
  completedRide: RideDetails | null;
  acceptRide: (ride: RideDetails) => void;
  completeRide: () => void;
  cancelRide: () => void;
  closeInvoice: () => void;
};

const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: ReactNode }) {
  const [activeRide, setActiveRide] = useState<RideDetails | null>(null);
  const [completedRide, setCompletedRide] = useState<RideDetails | null>(null);
  const { user } = useAuth();

  const acceptRide = async (ride: RideDetails) => {
    if (!user) return;
    try {
        const rideRef = doc(db, "rides", ride.id);
        await updateDoc(rideRef, { 
            status: 'accepted',
            driverId: user.uid,
            driverName: user.displayName,
        });
        setCompletedRide(null);
        setActiveRide({ ...ride, driverId: user.uid, driverName: user.displayName || 'Driver' });
    } catch (error) {
        console.error("Failed to accept ride:", error);
    }
  };

  const completeRide = () => {
    if (activeRide) {
      setCompletedRide(activeRide);
      setActiveRide(null);
    }
  };
  
  const cancelRide = () => {
    setActiveRide(null);
  }

  const closeInvoice = () => {
    setCompletedRide(null);
  }

  return (
    <RideContext.Provider value={{ activeRide, completedRide, acceptRide, completeRide, cancelRide, closeInvoice }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}
