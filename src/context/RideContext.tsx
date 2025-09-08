
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { RideRequest } from '@/lib/types';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

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

  // Listen for changes on the active ride document
  useEffect(() => {
    if (!activeRide?.id) return;

      const unsub = onSnapshot(doc(db, "rides", activeRide.id), (doc) => {
        if (doc.exists()) {
          const data = { id: doc.id, ...doc.data() } as RideDetails;
          if (data.status === 'completed') {
            completeRide(data);
          } else if (data.status === 'cancelled_by_customer' || data.status === 'cancelled_by_driver') {
            cancelRide();
          } else {
            setActiveRide(data);
          }
        } else {
           setActiveRide(null); // Ride document was deleted
        }
      });
      return () => unsub();
    
  }, [activeRide?.id]);

  const acceptRide = async (ride: RideDetails) => {
    if (!user) return;
    
    const rideUpdate = {
        driverId: user.uid,
        driverName: user.displayName || 'Driver',
        driverAvatar: user.photoURL || '',
        status: 'accepted' as const,
    };
    const updatedRide = { ...ride, ...rideUpdate };

    // Optimistically update the state
    setActiveRide(updatedRide);
    setCompletedRide(null);

    // Then update the database
    try {
        const rideRef = doc(db, "rides", ride.id);
        await updateDoc(rideRef, rideUpdate);
    } catch(error) {
        console.error("Error accepting ride: ", error);
        // If the update fails, revert the state
        setActiveRide(null); 
    }
  };

  const completeRide = (rideData? : RideDetails) => {
    const rideToComplete = rideData || activeRide;
    if (rideToComplete) {
      setCompletedRide(rideToComplete);
      setActiveRide(null);
    }
  };
  
  const cancelRide = () => {
    setActiveRide(null);
    setCompletedRide(null);
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
