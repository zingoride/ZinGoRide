
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import type { RideRequest } from '@/lib/types';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, onSnapshot, collection, query, where, limit, Timestamp, Unsubscribe, orderBy } from 'firebase/firestore';

export type RideDetails = RideRequest;

type RideContextType = {
  activeRide: RideDetails | null;
  completedRide: RideDetails | null;
  acceptRide: (ride: RideDetails) => void;
  completeRide: () => void;
  cancelRide: () => void;
  closeInvoice: () => void;
  setRideListener: (callback: ((rides: RideDetails[]) => void) | null) => void;
};

const RideContext = createContext<RideContextType | undefined>(undefined);

// A simple, short, and royalty-free ping sound encoded in Base64
const PING_SOUND = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjQwLjEwMQAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAANAAAR2wAAMPwAAB2sAABTMAAAR2wAAAAAAAAUNCRYBAAAAiuu+//uQZAAAAAANAAAR2wAAMPwAAB2sAABTMAAAR2wAAAAAAAAUNCRYBAAAAiuu+";


export function RideProvider({ children }: { children: ReactNode }) {
  const [activeRide, setActiveRide] = useState<RideDetails | null>(null);
  const [completedRide, setCompletedRide] = useState<RideDetails | null>(null);
  const { user } = useAuth();
  const [rideListenerCallback, setRideListenerCallback] = useState<((rides: RideDetails[]) => void) | null>(null);
  const [firestoreListener, setFirestoreListener] = useState<Unsubscribe | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);


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
  
  // Set up or tear down the rides collection listener
   useEffect(() => {
    if (rideListenerCallback) {
      const q = query(
        collection(db, "rides"),
        where("status", "==", "booked"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests: RideDetails[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RideDetails));
        
        if (snapshot.docChanges().some(change => change.type === 'added')) {
             if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Error playing sound:", e));
            }
        }
        
        rideListenerCallback(requests);
      });
      
      setFirestoreListener(() => unsubscribe);
    } else {
      if (firestoreListener) {
        firestoreListener();
        setFirestoreListener(null);
      }
    }
    
    return () => {
       if (firestoreListener) {
        firestoreListener();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideListenerCallback]);
  

  const acceptRide = async (ride: RideDetails) => {
    if (!user) return;
    
    const rideUpdate = {
        driverId: user.uid,
        driverName: user.displayName || 'Driver',
        driverAvatar: user.photoURL || '',
        status: 'accepted' as const,
    };
    const updatedRide = { ...ride, ...rideUpdate };

    setActiveRide(updatedRide);
    setCompletedRide(null);

    try {
        const rideRef = doc(db, "rides", ride.id);
        await updateDoc(rideRef, rideUpdate);
    } catch(error) {
        console.error("Error accepting ride: ", error);
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
  
  const setRideListener = (callback: ((rides: RideDetails[]) => void) | null) => {
    setRideListenerCallback(() => callback);
  };

  return (
    <RideContext.Provider value={{ activeRide, completedRide, acceptRide, completeRide, cancelRide, closeInvoice, setRideListener }}>
      <audio ref={audioRef} src={PING_SOUND} preload="auto" />
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
