
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
import { useLanguage } from '@/context/LanguageContext';

const translations = {
    ur: {
        toPickup: "Pickup ke raaste par",
        toDropoff: "Dropoff ke raaste par",
        mapPlaceholder: "Live Map Placeholder",
        riderInfo: "Rider ki Maloomat",
        rideDetails: "Safar ki Tafseelat",
        pickupLocation: "Uthanay ki Jagah",
        dropoffLocation: "Manzil",
        navigateToPickup: "Navigate to Pickup",
        navigateToDropoff: "Navigate to Dropoff",
        startRide: "Start Ride",
        completeRide: "Ride Mukammal Karein",
        cancelRide: "Ride Mansookh Karein",
    },
    en: {
        toPickup: "On the way to Pickup",
        toDropoff: "On the way to Dropoff",
        mapPlaceholder: "Live Map Placeholder",
        riderInfo: "Rider Information",
        rideDetails: "Ride Details",
        pickupLocation: "Pickup Location",
        dropoffLocation: "Destination",
        navigateToPickup: "Navigate to Pickup",
        navigateToDropoff: "Navigate to Dropoff",
        startRide: "Start Ride",
        completeRide: "Complete Ride",
        cancelRide: "Cancel Ride",
    }
}

export function InProgressRide() {
  const { activeRide, completeRide, cancelRide } = useRide();
  const [isNavigating, setIsNavigating] = useState(false);
  const [rideStage, setRideStage] = useState<'pickup' | 'dropoff'>('pickup');
  const { language } = useLanguage();
  const t = translations[language];

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
    <div className="flex flex-col gap-8 items-start h-full">
      <div className="w-full h-[300px] rounded-lg overflow-hidden relative bg-muted flex flex-col items-center justify-center">
        <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="text-lg py-2 px-4 shadow-lg">
                 {rideStage === 'pickup' ? t.toPickup : t.toDropoff}
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
            <p className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-md">{t.mapPlaceholder}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        <Card>
          <CardHeader>
            <CardTitle>{t.riderInfo}</CardTitle>
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
            <CardTitle>{t.rideDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">{t.pickupLocation}</p>
                <p className="font-semibold">{pickup}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">{t.dropoffLocation}</p>
                <p className="font-semibold">{dropoff}</p>
              </div>
            </div>
             <div className="flex flex-col gap-2 mt-4">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleNavigate}>
                    <Navigation className="mr-2 h-5 w-5" />
                    {rideStage === 'pickup' ? t.navigateToPickup : t.navigateToDropoff}
                </Button>
                {rideStage === 'pickup' && (
                  <Button size="lg" className="w-full" onClick={handleStartRide}>
                    {t.startRide}
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        
        <div className='space-y-2'>
            <Button size="lg" className="w-full" onClick={completeRide} disabled={rideStage === 'pickup'}>
                {t.completeRide}
            </Button>
             <Button variant="destructive" size="lg" className="w-full" onClick={cancelRide}>
                <X className="mr-2 h-5 w-5" />
                {t.cancelRide}
            </Button>
        </div>

      </div>
    </div>
  );
}
