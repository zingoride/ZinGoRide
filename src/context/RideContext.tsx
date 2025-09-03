
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface RideDetails {
  id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  eta: string;
  rider?: {
    name: string;
    rating: number;
    avatarUrl: string;
    phone: string;
  };
}

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

  const acceptRide = (ride: RideDetails) => {
    const mockRider = {
      name: 'Ahmad Ali',
      rating: 4.8,
      avatarUrl: 'https://picsum.photos/100/100?random=1',
      phone: '+923001234567', // Dummy phone number
    };
    setCompletedRide(null);
    setActiveRide({ ...ride, rider: mockRider });
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
