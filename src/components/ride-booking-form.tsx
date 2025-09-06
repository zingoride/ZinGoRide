
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { RideRequest } from '@/lib/types';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


const translations = {
  ur: {
    pickupPlaceholder: "Aap kahan hain?",
    dropoffPlaceholder: "Kahan jana hai?",
    findRideButton: "Ride Dhundein",
    findingRide: "Ride dhoondi ja rahi hai...",
    rideRequestError: "Ride request karne mein masla hua.",
  },
  en: {
    pickupPlaceholder: "Where are you?",
    dropoffPlaceholder: "Where to?",
    findRideButton: "Find Ride",
    findingRide: "Finding Ride...",
    rideRequestError: "Error requesting ride.",
  }
}

export function RideBookingForm({ onFindRide }: { onFindRide: (rideDetails: RideRequest) => void }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pickup, setPickup] = useState('Saddar, Karachi');
  const [dropoff, setDropoff] = useState('Clifton, Karachi');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

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
            status: 'pending',
            // other fields are optional for now
        }
        
        const ridesCollection = collection(db, "rides");
        const docRef = await addDoc(ridesCollection, {
            ...rideDetails,
            createdAt: serverTimestamp(),
        });
        
        onFindRide({ ...rideDetails, id: docRef.id, createdAt: new Date(), status: 'booked' });

    } catch (error) {
        console.error("Error creating ride request:", error);
        toast({
            variant: "destructive",
            title: t.rideRequestError,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
