
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
import { addDoc, collection, serverTimestamp, GeoPoint, Timestamp } from 'firebase/firestore';


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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const t = translations[language];

  const reverseGeocode = async (lat: number, lng: number) => {
     try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            return data.display_name;
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            setPickupCoords({ lat: latitude, lng: longitude });
            const address = await reverseGeocode(latitude, longitude);
            setPickup(address);
            toast({ title: t.locationSuccess });
            setIsGettingLocation(false);
        },
        () => {
            toast({ variant: 'destructive', title: t.locationError });
            setIsGettingLocation(false);
        }
    );
  }

  const getCurrentLocation = (): Promise<{latitude: number, longitude: number}> => {
      return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
              return reject(new Error("Geolocation not supported"));
          }
          navigator.geolocation.getCurrentPosition(
              (position) => resolve(position.coords),
              (error) => reject(error)
          );
      });
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
        let finalPickupCoords = pickupCoords;
        if (!finalPickupCoords) {
            const coords = await getCurrentLocation();
            finalPickupCoords = { lat: coords.latitude, lng: coords.longitude };
            if (!pickup) { // If pickup address is empty, geocode it
                const address = await reverseGeocode(coords.latitude, coords.longitude);
                setPickup(address);
            }
        }
        
        const rideData: Omit<RideRequest, 'id' | 'createdAt'> & { createdAt: any; } = {
            pickup: pickup || "Current Location",
            dropoff,
            customerId: user.uid,
            customerName: user.displayName || "Unknown",
            customerAvatar: user.photoURL || undefined,
            status: 'searching',
            createdAt: serverTimestamp(),
            pickupCoords: new GeoPoint(finalPickupCoords.lat, finalPickupCoords.lng),
        };
        
        const ridesCollection = collection(db, "rides");
        const docRef = await addDoc(ridesCollection, rideData);
        
        onFindRide({ 
            ...rideData, 
            id: docRef.id, 
            createdAt: new Date(),
        } as RideRequest);

    } catch (error) {
        console.error("Error creating ride request:", error);
        toast({
            variant: "destructive",
            title: t.rideRequestError,
        });
        setLoading(false);
    }
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
                disabled={isGettingLocation}
                aria-label={t.useMyLocation}
            >
                {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            </Button>
            <Input
                id="pickup"
                placeholder={isGettingLocation ? t.gettingLocation : t.pickupPlaceholder}
                className="pl-10 h-12 text-base pr-10"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
                disabled={isGettingLocation}
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

    