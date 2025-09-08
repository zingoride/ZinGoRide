
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Circle, LocateFixed } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { RideRequest } from '@/lib/types';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { useLocationPermission } from '@/context/LocationPermissionContext';


const translations = {
  ur: {
    pickupPlaceholder: "Kahan se?",
    dropoffPlaceholder: "Kahan jana hai?",
    findRideButton: "Ride Dhundein",
    findingRide: "Ride dhoondi ja rahi hai...",
    rideRequestError: "Ride request karne mein masla hua.",
    locationError: "Aapki location haasil nahi ho saki.",
    locationSuccess: "Aapki location set ho gayi hai.",
    myLocation: "Meri Maujooda Location",
    useMyLocation: "Meri Location Istemal Karein",
    gettingLocation: "Location haasil ki ja rahi hai...",
    enableLocation: "Location ki Ijazat Dein",
    noAddressFound: "Is location par koi address nahi mila.",
  },
  en: {
    pickupPlaceholder: "Where from?",
    dropoffPlaceholder: "Where to?",
    findRideButton: "Find Ride",
    findingRide: "Finding Ride...",
    rideRequestError: "Error requesting ride.",
    locationError: "Could not get your location.",
    locationSuccess: "Your location has been set.",
    myLocation: "My Current Location",
    useMyLocation: "Use My Location",
    gettingLocation: "Getting location...",
    enableLocation: "Enable Location",
    noAddressFound: "No address found for this location.",
  }
}

interface RideBookingFormProps {
    onFindRide: (rideDetails: RideRequest) => void;
}

export function RideBookingForm({ onFindRide }: RideBookingFormProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pickup, setPickup] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualLocationLoading, setManualLocationLoading] = useState(false);
  
  const { hasPermission, requestPermission, isCheckingPermission } = useLocationPermission();
  const t = translations[language];

  const handleUseMyLocation = async () => {
    setManualLocationLoading(true);
    const permissionGranted = await requestPermission();
    if (!permissionGranted) {
        toast({ variant: 'destructive', title: t.locationError });
        setManualLocationLoading(false);
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            setPickupCoords({ lat: latitude, lng: longitude });

            // Reverse geocode using OpenStreetMap
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                if (data && data.display_name) {
                    setPickup(data.display_name);
                    toast({ title: t.locationSuccess });
                } else {
                    setPickup(t.myLocation);
                    toast({ variant: 'destructive', title: t.noAddressFound });
                }
            } catch (error) {
                console.error("Reverse geocoding error:", error);
                setPickup(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                toast({ variant: 'destructive', title: t.locationError });
            } finally {
                setManualLocationLoading(false);
            }
        },
        () => {
            toast({ variant: 'destructive', title: t.locationError });
            setManualLocationLoading(false);
        }
    );
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to book a ride.",
      });
      return;
    }
    setLoading(true);

    try {
        const pickupGeoPoint = pickupCoords ? new GeoPoint(pickupCoords.lat, pickupCoords.lng) : undefined;
        
        const rideDetails: Omit<RideRequest, 'id' | 'createdAt'> = {
            pickup,
            dropoff,
            customerId: user.uid,
            customerName: user.displayName || "Unknown",
            customerAvatar: user.photoURL || undefined,
            status: 'pending', // Important: Status is 'pending' to show vehicle selection
            pickupCoords: pickupGeoPoint,
        }
        
        const ridesCollection = collection(db, "rides");
        const docRef = await addDoc(ridesCollection, {
            ...rideDetails,
            createdAt: serverTimestamp(),
        });
        
        // Pass the newly created ride (with 'pending' status) to the parent page
        onFindRide({ 
            ...rideDetails, 
            id: docRef.id, 
            createdAt: new Date(),
        });

    } catch (error) {
        console.error("Error creating ride request:", error);
        toast({
            variant: "destructive",
            title: t.rideRequestError,
        });
        setLoading(false); // Only set loading to false on error
    }
    // On success, the parent component will switch views, so no need to set loading to false.
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="relative">
            <Circle className="absolute left-3 top-[1.1rem] -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleUseMyLocation}
                disabled={manualLocationLoading || isCheckingPermission}
                aria-label={t.useMyLocation}
            >
                {manualLocationLoading || isCheckingPermission ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            </Button>
            <Input
                id="pickup"
                placeholder={isCheckingPermission ? t.gettingLocation : t.pickupPlaceholder}
                className="pl-10 h-12 text-base pr-10"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
                disabled={isCheckingPermission || manualLocationLoading}
            />
        </div>
        
        <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                id="dropoff"
                placeholder={t.dropoffPlaceholder}
                className="pl-10 h-12 text-base"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                required
            />
        </div>
        <Button type="submit" className="w-full h-12 text-base" disabled={loading || isCheckingPermission}>
        {loading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.findingRide}
            </>
        ) : (
            <>{t.findRideButton}</>
        )}
        </Button>
    </form>
  );
}
