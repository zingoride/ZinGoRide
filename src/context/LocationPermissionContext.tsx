
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, GeoPoint } from 'firebase/firestore';
import { useRiderStatus } from './RiderStatusContext';

interface LocationPermissionContextType {
  hasPermission: boolean;
  error: GeolocationPositionError | null;
  requestPermission: () => Promise<boolean>;
}

const LocationPermissionContext = createContext<LocationPermissionContextType | undefined>(undefined);

export function LocationPermissionProvider({ children }: { children: ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);
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
                setHasPermission(true);
                setError(null);
                updateLocationInFirestore(position);
            },
            (err) => {
                console.error("Geolocation error:", err);
                setHasPermission(false);
                setError(err);
                // If permission is denied while watching, stop watching.
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
  }, [updateLocationInFirestore]);

  const stopWatching = () => {
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setError(new GeolocationPositionError());
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
        }
      );
    });
  };
  
  // Effect to check permission on mount
  useEffect(() => {
    if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            const isGranted = permissionStatus.state === 'granted';
            setHasPermission(isGranted);

            permissionStatus.onchange = () => {
                const isNowGranted = permissionStatus.state === 'granted';
                setHasPermission(isNowGranted);
                 if(!isNowGranted) {
                    stopWatching();
                }
            };
        });
    } else {
        // Fallback for browsers that don't support Permissions API
        navigator.geolocation.getCurrentPosition(() => setHasPermission(true), () => setHasPermission(false));
    }
  }, []);

  // Effect to start/stop watching based on online status and permission
  useEffect(() => {
    if (isOnline && hasPermission) {
      startWatching();
    } else {
      stopWatching();
    }
    
    return () => stopWatching();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, hasPermission, startWatching]);


  return (
    <LocationPermissionContext.Provider value={{ hasPermission, error, requestPermission }}>
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
