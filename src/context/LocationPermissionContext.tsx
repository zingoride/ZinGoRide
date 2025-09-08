
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, GeoPoint } from 'firebase/firestore';
import { useRiderStatus } from './RiderStatusContext';

interface LocationPermissionContextType {
  hasPermission: boolean;
  error: GeolocationPositionError | null;
}

const LocationPermissionContext = createContext<LocationPermissionContextType | undefined>(undefined);

export function LocationPermissionProvider({ children }: { children: ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const { user } = useAuth();
  const { isOnline } = useRiderStatus();
  const locationWatchId = React.useRef<number | null>(null);

  const updateLocationInFirestore = async (position: GeolocationPosition) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        location: new GeoPoint(position.coords.latitude, position.coords.longitude)
      }, { merge: true });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const startWatching = () => {
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
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }
  };

  const stopWatching = () => {
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
  };
  
  // Effect to check permission on mount
  useEffect(() => {
    if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            setHasPermission(permissionStatus.state === 'granted');
            permissionStatus.onchange = () => {
                setHasPermission(permissionStatus.state === 'granted');
                 if(permissionStatus.state !== 'granted') {
                    stopWatching();
                }
            };
        });
    }
  }, []);

  // Effect to start/stop watching based on online status
  useEffect(() => {
    if (isOnline && hasPermission) {
      startWatching();
    } else {
      stopWatching();
    }
    
    return () => stopWatching();
  }, [isOnline, hasPermission]);


  return (
    <LocationPermissionContext.Provider value={{ hasPermission, error }}>
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
