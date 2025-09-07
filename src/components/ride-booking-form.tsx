
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


const translations = {
  ur: {
    pickupPlaceholder: "Kahan se?",
    dropoffPlaceholder: "Kahan jana hai?",
    findRideButton: "Ride Dhundein",
    findingRide: "Ride dhoondi ja rahi hai...",
    rideRequestError: "Ride request karne mein masla hua.",
    locationError: "Location hasil karne mein masla hua.",
    locationSuccess: "Aapki location set ho gayi hai.",
    myLocation: "Meri Maujooda Location",
    useMyLocation: "Meri Location Istemal Karein",
    gettingLocation: "Location haasil ki ja rahi hai...",
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
  }
}

export function RideBookingForm({ onFindRide }: { onFindRide: (rideDetails: RideRequest) => void }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('Clifton, Karachi');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);

  const t = translations[language];

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPickupCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setPickup(t.myLocation);
                setGettingLocation(false);
                toast({ title: t.locationSuccess });
            },
            () => {
                toast({ variant: 'destructive', title: t.locationError });
                setGettingLocation(false);
            }
        );
    } else {
        toast({ variant: 'destructive', title: "Geolocation is not supported by your browser." });
    }
  }
  
  useEffect(() => {
    handleGetCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        const rideDetails: Omit<RideRequest, 'id' | 'createdAt'> = {
            pickup,
            dropoff,
            customerId: user.uid,
            customerName: user.displayName || "Unknown",
            status: 'pending', // Important: Status is 'pending' to show vehicle selection
            pickupCoords: pickupCoords ? new GeoPoint(pickupCoords.lat, pickupCoords.lng) : undefined
        }
        
        const ridesCollection = collection(db, "rides");
        const docRef = await addDoc(ridesCollection, {
            ...rideDetails,
            createdAt: serverTimestamp(),
        });
        
        // Pass the newly created ride (with 'pending' status) to the parent page
        onFindRide({ ...rideDetails, id: docRef.id, createdAt: new Date() });

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
            <Circle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                id="pickup"
                placeholder={t.pickupPlaceholder}
                className="pl-10 h-12 text-base"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
            />
        </div>
        <Button type="button" variant="outline" onClick={handleGetCurrentLocation} disabled={gettingLocation}>
            {gettingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
            {gettingLocation ? t.gettingLocation : t.useMyLocation}
        </Button>
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
        <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
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
