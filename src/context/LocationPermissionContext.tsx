
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
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
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

  const startWatching = useCallback(() => {
    if ('geolocation' in navigator && locationWatchId.current === null) {
        locationWatchId.current = navigator.geolocation.watchPosition(
            (position) => {
                if (!hasPermission) setHasPermission(true);
                setError(null);
                updateLocationInFirestore(position);
            },
            (err) => {
                console.error("Geolocation error:", err);
                if (hasPermission) setHasPermission(false);
                setError(err);
                if (err.code === err.PERMISSION_DENIED) {
                    if (locationWatchId.current !== null) {
                        navigator.geolocation.clearWatch(locationWatchId.current);
                        locationWatchId.current = null;
                    }
                }
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

  const requestPermission = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        // setError should be handled appropriately if needed
        resolve(false);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasPermission(true);
          setError(null);
          updateLocationInFirestore(position);
          resolve(true);
        },
        (err) => {
          setError(err);
          setHasPermission(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, [updateLocationInFirestore]);
  
  useEffect(() => {
    setIsCheckingPermission(true);
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            setHasPermission(permissionStatus.state === 'granted');
            setIsCheckingPermission(false);
            permissionStatus.onchange = () => {
                const isGranted = permissionStatus.state === 'granted';
                setHasPermission(isGranted);
                 if(!isGranted) {
                    stopWatching();
                }
            };
        });
    } else {
        setIsCheckingPermission(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
