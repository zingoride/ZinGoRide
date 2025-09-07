
'use client';

import { useState } from 'react';
import { Car, Bike, PersonStanding } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import type { RideRequest } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const rideOptions = [
  {
    type: 'Bike',
    icon: Bike,
    eta: '5 min',
    price: '150',
    seats: 1,
    image: 'https://picsum.photos/seed/bike/200/150',
    imageHint: 'motorcycle side view'
  },
  {
    type: 'Car',
    icon: Car,
    eta: '8 min',
    price: '350',
    seats: 4,
    image: 'https://picsum.photos/seed/car/200/150',
    imageHint: 'white car side view'
  },
  {
    type: 'Rickshaw',
    icon: Car,
    eta: '6 min',
    price: '200',
    seats: 3,
    image: 'https://picsum.photos/seed/rickshaw/200/150',
    imageHint: 'auto rickshaw'
  },
];

const translations = {
    ur: {
        chooseRide: "Ride Chunein",
        eta: "Andazan waqt",
        seats: "seats",
        confirmRide: "Ride Confirm Karein",
        confirming: "Confirming...",
        rideConfirmedTitle: "Ride Confirmed!",
        rideConfirmedDesc: "Aapke liye driver dhoonda ja raha hai.",
        rideUpdateError: "Ride confirm karne mein masla hua."
    },
    en: {
        chooseRide: "Choose a Ride",
        eta: "ETA",
        seats: "seats",
        confirmRide: "Confirm Ride",
        confirming: "Confirming...",
        rideConfirmedTitle: "Ride Confirmed!",
        rideConfirmedDesc: "Finding a driver for you.",
        rideUpdateError: "Error confirming ride."
    }
}

interface AvailableRidesProps {
    ride: RideRequest;
    onConfirm: (confirmedRide: RideRequest) => void;
}

export function AvailableRides({ ride, onConfirm }: AvailableRidesProps) {
  const [selectedRide, setSelectedRide] = useState('Car');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const handleConfirmRide = async () => {
    setLoading(true);
    
    try {
        const rideRef = doc(db, "rides", ride.id);
        const selectedRideDetails = rideOptions.find(r => r.type === selectedRide);
        
        const updateData = {
            status: 'booked' as const,
            vehicleType: selectedRide as any,
            fare: selectedRideDetails ? parseFloat(selectedRideDetails.price) : 0,
        };

        // We update the database. The parent's onSnapshot listener will handle the UI transition.
        await updateDoc(rideRef, updateData);

        toast({
            title: t.rideConfirmedTitle,
            description: t.rideConfirmedDesc,
        });

    } catch (error) {
        console.error("Error confirming ride: ", error);
        toast({ variant: "destructive", title: t.rideUpdateError });
        setLoading(false);
    } 
    // No need to set loading to false here, as the component will unmount or be replaced.
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-center">{t.chooseRide}</h3>
          <div className="space-y-3">
            {rideOptions.map((option) => (
              <div
                key={option.type}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all',
                  selectedRide === option.type
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => setSelectedRide(option.type)}
              >
                <Image
                  src={option.image}
                  alt={option.type}
                  width={80}
                  height={60}
                  className="rounded-md object-cover"
                  data-ai-hint={option.imageHint}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className='flex items-center gap-2'>
                        <option.icon className="h-5 w-5" />
                        <p className="font-bold text-md">{option.type}</p>
                    </div>
                    <p className="font-bold text-md">PKR {option.price}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                     <p>{t.eta}: {option.eta}</p>
                     <p>{option.seats} {t.seats}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={handleConfirmRide} disabled={loading}>
             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t.confirming : t.confirmRide}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
