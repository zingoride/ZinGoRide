
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, GeoPoint } from 'firebase/firestore';
import { useRiderStatus } from './RiderStatusContext';

interface LocationPermissionContextType {
  hasPermission: boolean;
  isCheckingPermission: boolean;
  error: GeolocationPositionError | null;
  requestPermission: () => Promise<boolean>;
}

const LocationPermissionContext = createContext<LocationPermissionContextType | undefined>(undefined);

export function LocationPermissionProvider({ children }: { children: ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const { user } = useAuth();
  const { isOnline } = useRiderStatus();
  const locationWatchId = React.useRef<number | null>(null);

  const updateLocationInFirestore = useCallback(async (position: GeolocationPosition) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        location: new GeoPoint(position.coords.latitude, position.coords.longitude)
      }, { merge: true });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  }, [user]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsCheckingPermission(true);
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setError({
            code: 0,
            message: "Geolocation is not supported by your browser.",
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
        } as GeolocationPositionError);
        setIsCheckingPermission(false);
        resolve(false);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasPermission(true);
          setError(null);
          updateLocationInFirestore(position);
          setIsCheckingPermission(false);
          resolve(true);
        },
        (err) => {
          setError(err);
          setHasPermission(false);
          setIsCheckingPermission(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, [updateLocationInFirestore]);

  const startWatching = useCallback(() => {
    if ('geolocation' in navigator && hasPermission && locationWatchId.current === null) {
        locationWatchId.current = navigator.geolocation.watchPosition(
            (position) => {
                setError(null);
                updateLocationInFirestore(position);
            },
            (err) => {
                console.error("Geolocation watch error:", err);
                setError(err);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    }
  }, [updateLocationInFirestore, hasPermission]);

  const stopWatching = () => {
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
  };

  useEffect(() => {
    if (isOnline && hasPermission) {
      startWatching();
    } else {
      stopWatching();
    }
    
    return () => stopWatching();
  }, [isOnline, hasPermission, startWatching]);


  return (
    <LocationPermissionContext.Provider value={{ hasPermission, isCheckingPermission, error, requestPermission }}>
      {children}
    </LocationPermissionContext.Provider>
  );
}

export function useLocationPermission() {
  const context = useContext(LocationPermissionContext);
  if (context === undefined) {
    throw new Error('useLocationPermission must be used within a LocationPermissionProvider');
  }
  return context;
}
