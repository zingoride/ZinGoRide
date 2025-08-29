
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  X,
  Star,
  Navigation,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useRide } from '@/context/RideContext';
import { ChatDialog } from './chat-dialog';
import { Badge } from './ui/badge';


export function InProgressRide() {
  const { activeRide, completeRide, cancelRide } = useRide();
  const [isNavigating, setIsNavigating] = useState(false);
  const [rideStage, setRideStage] = useState<'pickup' | 'dropoff'>('pickup');


  if (!activeRide) {
    return null;
  }

  const { pickup, dropoff, rider } = activeRide;

  const handleCall = () => {
    if (rider?.phone) {
      window.location.href = `tel:${rider.phone}`;
    }
  };
  
  const handleNavigate = () => {
    setIsNavigating(true);
  };
  
  const handleStartRide = () => {
    setRideStage('dropoff');
    setIsNavigating(true); // Automatically start navigation to dropoff
  }

  const mapImageUrl = isNavigating 
    ? (rideStage === 'pickup' ? "https://picsum.photos/seed/map-route/1600/1200" : "https://picsum.photos/seed/map-dropoff/1600/1200")
    : "https://picsum.photos/seed/map-view/1600/1200";
    
  const mapHint = isNavigating
    ? (rideStage === 'pickup' ? "navigation route map" : "navigation destination map")
    : "street map";


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
      <div className="lg:col-span-2 h-[450px] lg:h-[calc(100vh-10rem)] rounded-lg overflow-hidden relative bg-muted flex flex-col items-center justify-center">
        <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="text-lg py-2 px-4 shadow-lg">
                 {rideStage === 'pickup' ? 'On the way to Pickup' : 'On the way to Dropoff'}
            </Badge>
        </div>
        <Image
          src={mapImageUrl}
          alt="Map with route"
          fill
          style={{objectFit:"cover"}}
          data-ai-hint={mapHint}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-lg">Live Map Placeholder</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rider ki Maloomat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={rider?.avatarUrl} data-ai-hint="portrait woman" />
                        <AvatarFallback>
                        {rider?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xl font-bold">{rider?.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{rider?.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleCall}>
                        <Phone className="h-5 w-5" />
                    </Button>
                    <ChatDialog riderName={rider?.name || 'Rider'} />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safar ki Tafseelat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Uthanay ki Jagah</p>
                <p className="font-semibold">{pickup}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Manzil</p>
                <p className="font-semibold">{dropoff}</p>
              </div>
            </div>
             <div className="flex flex-col gap-2 mt-4">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleNavigate}>
                    <Navigation className="mr-2 h-5 w-5" />
                    {rideStage === 'pickup' ? 'Navigate to Pickup' : 'Navigate to Dropoff'}
                </Button>
                {rideStage === 'pickup' && (
                  <Button size="lg" className="w-full" onClick={handleStartRide}>
                    Start Ride
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        
        <div className='space-y-2'>
            <Button size="lg" className="w-full" onClick={completeRide} disabled={rideStage === 'pickup'}>
                Ride Mukammal Karein
            </Button>
             <Button variant="destructive" size="lg" className="w-full" onClick={cancelRide}>
                <X className="mr-2 h-5 w-5" />
                Ride Mansookh Karein
            </Button>
        </div>

      </div>
    </div>
  );
}
