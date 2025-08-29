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
  acceptRide: (ride: RideDetails) => void;
  completeRide: () => void;
  cancelRide: () => void;
};

const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: ReactNode }) {
  const [activeRide, setActiveRide] = useState<RideDetails | null>(null);

  const acceptRide = (ride: RideDetails) => {
    const mockRider = {
      name: 'Ahmad Ali',
      rating: 4.8,
      avatarUrl: 'https://picsum.photos/100/100?random=1',
      phone: '+923001234567', // Dummy phone number
    };
    setActiveRide({ ...ride, rider: mockRider });
  };

  const completeRide = () => {
    setActiveRide(null);
  };
  
  const cancelRide = () => {
    setActiveRide(null);
  }

  return (
    <RideContext.Provider value={{ activeRide, acceptRide, completeRide, cancelRide }}>
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
