
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { RideRequest } from '@/lib/types';

const translations = {
  ur: {
    pickupPlaceholder: "Uthanay ki jagah?",
    dropoffPlaceholder: "Kahan jana hai?",
    findRideButton: "Ride Dhundein",
    findingRide: "Ride dhoondi ja rahi hai...",
    rideRequestError: "Ride request karne mein masla hua.",
  },
  en: {
    pickupPlaceholder: "Pickup location?",
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
      const rideDetails: Omit<RideRequest, 'id'> = {
        pickup,
        dropoff,
        customerId: user.uid,
        customerName: user.displayName || "Unknown",
        status: 'pending',
        createdAt: serverTimestamp(),
      }
      
      const docRef = await addDoc(collection(db, "rides"), rideDetails);
      
      onFindRide({ ...rideDetails, id: docRef.id });

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: t.rideRequestError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="pickup"
              placeholder={t.pickupPlaceholder}
              className="pl-10"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="dropoff"
              placeholder={t.dropoffPlaceholder}
              className="pl-10"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.findingRide}
                </>
            ) : (
                <>
                    <ArrowRight className="mr-2 h-4 w-4" /> {t.findRideButton}
                </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
