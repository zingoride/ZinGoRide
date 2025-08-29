
'use client';

import { useState } from 'react';
import { Car, Bike, PersonStanding } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

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

export function AvailableRides({ onConfirmRide }: { onConfirmRide: () => void }) {
  const [selectedRide, setSelectedRide] = useState('Car');
  const { toast } = useToast();

  const handleConfirmRide = () => {
    toast({
      title: "Ride Confirmed!",
      description: "Aapki ride book ho gayi hai. Driver jald hi aap se rabta karega.",
    });
    onConfirmRide();
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-center">Ride Chunein</h3>
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
                     <p>Andazan waqt: {ride.eta}</p>
                     <p>{ride.seats} seats</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={handleConfirmRide}>
            Ride Confirm Karein
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
