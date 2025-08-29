
'use client';

import { useState } from 'react';
import { Car, Bike, PersonStanding } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const rideOptions = [
  {
    type: 'Bike',
    icon: Bike,
    eta: '5 min',
    price: 'PKR 150',
    seats: 1,
    image: 'https://picsum.photos/seed/bike/200/150',
    imageHint: 'motorcycle side view'
  },
  {
    type: 'Car',
    icon: Car,
    eta: '8 min',
    price: 'PKR 350',
    seats: 4,
    image: 'https://picsum.photos/seed/car/200/150',
    imageHint: 'white car side view'
  },
  {
    type: 'Rickshaw',
    icon: PersonStanding,
    eta: '6 min',
    price: 'PKR 200',
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
        rideConfirmedTitle: "Ride Confirmed!",
        rideConfirmedDesc: "Aapki ride book ho gayi hai. Driver jald hi aap se rabta karega.",
    },
    en: {
        chooseRide: "Choose a Ride",
        eta: "ETA",
        seats: "seats",
        confirmRide: "Confirm Ride",
        rideConfirmedTitle: "Ride Confirmed!",
        rideConfirmedDesc: "Your ride has been booked. The driver will contact you shortly.",
    }
}

export function AvailableRides({ onConfirmRide }: { onConfirmRide: () => void }) {
  const [selectedRide, setSelectedRide] = useState('Car');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const handleConfirmRide = () => {
    toast({
      title: t.rideConfirmedTitle,
      description: t.rideConfirmedDesc,
    });
    onConfirmRide();
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-center">{t.chooseRide}</h3>
          <div className="space-y-3">
            {rideOptions.map((ride) => (
              <div
                key={ride.type}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all',
                  selectedRide === ride.type
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => setSelectedRide(ride.type)}
              >
                <Image
                  src={ride.image}
                  alt={ride.type}
                  width={80}
                  height={60}
                  className="rounded-md object-cover"
                  data-ai-hint={ride.imageHint}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className='flex items-center gap-2'>
                        <ride.icon className="h-5 w-5" />
                        <p className="font-bold text-md">{ride.type}</p>
                    </div>
                    <p className="font-bold text-md">{ride.price}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                     <p>{t.eta}: {ride.eta}</p>
                     <p>{ride.seats} {t.seats}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={handleConfirmRide}>
            {t.confirmRide}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
