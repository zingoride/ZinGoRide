
'use client';

import { useState, useEffect, useRef } from 'react';
import { RideRequest as RideRequestComponent } from '@/components/ride-request';
import { useRiderStatus } from '@/context/RiderStatusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, DollarSign, Map } from 'lucide-react';
import { useRide } from '@/context/RideContext';
import { InProgressRide } from '@/components/in-progress-ride';
import { RideInvoice } from '@/components/ride-invoice';
import { useLanguage } from '@/context/LanguageContext';
import type { RideRequest } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, setDoc, GeoPoint } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const translations = {
  ur: {
    youAreOffline: "Aap Offline Hain",
    youAreOnline: "Aap Online Hain",
    goOnlineToReceive: "Nayi ride requests hasil karne ke liye online jayen.",
    goOnline: "Go Online",
    goOffline: "Go Offline",
    todaysEarnings: "Aaj Ki Kamai",
    fromYesterday: "+0% pichle din se",
    thisWeekEarnings: "Is Haftay Ki Kamai",
    fromLastWeek: "+0% pichle haftay se",
    weeklyGoal: "Haftawar Had",
    goalCompleted: "0% hadaf mukammal",
    searchingForRides: "Rides dhoondi ja rahi hain...",
    newRideRequestsWillAppear: "Aap online hain. Nayi ride requests yahan nazar aayengi.",
    locationPermissionError: "Location ki ijazat chahiye",
    locationPermissionDesc: "Live location share karne ke liye, please browser mein location ki ijazat dein.",
    newRideRequestToast: "Nayi Ride Request!",
    newRideRequestToastDesc: (pickup: string, dropoff: string) => `${pickup} se ${dropoff} tak.`,
    fetchError: "Error",
    fetchErrorDesc: "Could not fetch new ride requests. Please ensure you have created the necessary Firestore index.",
  },
  en: {
    youAreOffline: "You are Offline",
    youAreOnline: "You are Online",
    goOnlineToReceive: "Go online to receive new ride requests.",
    goOnline: "Go Online",
    goOffline: "Go Offline",
    todaysEarnings: "Today's Earnings",
    fromYesterday: "+0% from yesterday",
    thisWeekEarnings: "This Week's Earnings",
    fromLastWeek: "+0% from last week",
    weeklyGoal: "Weekly Goal",
    goalCompleted: "0% goal completed",
    searchingForRides: "Searching for rides...",
    newRideRequestsWillAppear: "You are online. New ride requests will appear here.",
    locationPermissionError: "Location Permission Required",
    locationPermissionDesc: "To share your live location, please enable location permissions in your browser.",
    newRideRequestToast: "New Ride Request!",
    newRideRequestToastDesc: (pickup: string, dropoff: string) => `From ${pickup} to ${dropoff}.`,
    fetchError: "Error",
    fetchErrorDesc: "Could not fetch new ride requests. Please ensure you have created the necessary Firestore index.",
  }
}

// A simple, short, and royalty-free ping sound encoded in Base64
const PING_SOUND = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjQwLjEwMQAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAANAAAR2wAAMPwAAB2sAABTMAAAR2wAAAAAAAAUNCRYBAAAAiuu+//uQZAAAAAANAAAR2wAAMPwAAB2sAABTMAAAR2wAAAAAAAAUNCRYBAAAAiuu+";

export default function Dashboard() {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const { isOnline, toggleStatus } = useRiderStatus();
  const { activeRide, completedRide } = useRide();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const t = translations[language];
  const locationWatchId = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const knownRideIds = useRef(new Set());


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

  const startWatchingLocation = () => {
    if (navigator.geolocation) {
      locationWatchId.current = navigator.geolocation.watchPosition(
        updateLocationInFirestore,
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            variant: "destructive",
            title: t.locationPermissionError,
            description: t.locationPermissionDesc,
          });
          if(isOnline) toggleStatus(); // Go back offline if permission is denied
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
       toast({
          variant: "destructive",
          title: t.locationPermissionError,
          description: "Geolocation is not supported by this browser.",
       });
       if(isOnline) toggleStatus();
    }
  };

  const stopWatchingLocation = () => {
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
  };
  
  useEffect(() => {
    if (isOnline) {
      startWatchingLocation();
    } else {
      stopWatchingLocation();
    }

    return () => {
      stopWatchingLocation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);


  useEffect(() => {
    if (!isOnline || activeRide) {
      setRideRequests([]);
      return;
    }
    
    // Listen for newly booked rides that need a driver.
    const ridesRef = collection(db, "rides");
    const q = query(
      ridesRef, 
      where("status", "==", "booked"), 
      orderBy("createdAt", "desc"),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests: RideRequest[] = [];
      let isNewRequest = false;

      querySnapshot.forEach((doc) => {
        const requestData = { id: doc.id, ...doc.data() } as RideRequest;
        requests.push(requestData);
        
        if (!knownRideIds.current.has(requestData.id)) {
            isNewRequest = true;
            knownRideIds.current.add(requestData.id);
            toast({
                title: t.newRideRequestToast,
                description: t.newRideRequestToastDesc(requestData.pickup, requestData.dropoff),
            });
        }
      });
      
      setRideRequests(requests);
      
      if (isNewRequest && audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
      }

    }, (error) => {
        console.error("Error fetching ride requests: ", error);
        toast({
            variant: "destructive",
            title: t.fetchError,
            description: t.fetchErrorDesc,
        });
    });

    return () => unsubscribe();
  }, [isOnline, activeRide, toast, t]);

  if (completedRide) {
    return <RideInvoice ride={completedRide} />;
  }
  
  if (activeRide) {
    return <InProgressRide />;
  }

  if (!isOnline) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center p-4">
        <audio ref={audioRef} src={PING_SOUND} preload="auto"></audio>
        <div className="flex flex-col items-center gap-2">
            <WifiOff className="h-16 w-16 text-muted-foreground" />
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{t.youAreOffline}</h1>
                <p className="text-muted-foreground text-sm">{t.goOnlineToReceive}</p>
            </div>
             <Button onClick={toggleStatus} size="lg" className="w-full max-w-sm mt-4">
                {t.goOnline}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
       <audio ref={audioRef} src={PING_SOUND} preload="auto"></audio>
      {rideRequests.length > 0 ? (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <div className="grid gap-4">
            {rideRequests.map((request) => (
              <RideRequestComponent key={request.id} {...request} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-4 h-[calc(100vh-12rem)]">
             <div className="text-center text-muted-foreground space-y-2">
                <h2 className="text-2xl font-semibold">{t.searchingForRides}</h2>
                <p>{t.newRideRequestsWillAppear}</p>
            </div>
        </div>
      )}
    </div>
  );
}
