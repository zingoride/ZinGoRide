
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Phone,
  X,
  Star,
  Navigation,
  Map,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useRide } from '@/context/RideContext';
import { ChatDialog } from './chat-dialog';
import { Badge } from './ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { RideRequest } from '@/lib/types';
import L from 'leaflet';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const DynamicMap = dynamic(() => import('@/components/dynamic-map'), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> 
});


// Define custom icons directly in the file that uses them
export const carIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png',
  iconRetinaUrl: 'https://img.icons8.com/ios-filled/100/000000/car.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export const customerIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png',
  iconRetinaUrl: 'https://img.icons8.com/ios-filled/100/000000/user-male-circle.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const mockCoordinates = {
    driver: [24.88, 67.05], // Driver initial position
    customer: [24.8607, 67.0011] // Customer pickup
};


const translations = {
    ur: {
        toPickup: "Pickup ke raaste par",
        toDropoff: "Dropoff ke raaste par",
        riderInfo: "Customer ki Maloomat",
        rideDetails: "Safar ki Tafseelat",
        pickupLocation: "Uthanay ki Jagah",
        dropoffLocation: "Manzil",
        navigateToPickup: "Navigate to Pickup",
        navigateToDropoff: "Navigate to Dropoff",
        startRide: "Start Ride",
        completeRide: "Ride Mukammal Karein",
        cancelRide: "Ride Mansookh Karein",
        rideStarted: "Safar shuru ho gaya!",
        rideCompleted: "Safar mukammal ho gaya!",
        errorUpdating: "Status update karne mein masla hua.",
        rideCancelled: "Ride has been cancelled.",
    },
    en: {
        toPickup: "On the way to Pickup",
        toDropoff: "On the way to Dropoff",
        riderInfo: "Customer Information",
        rideDetails: "Ride Details",
        pickupLocation: "Pickup Location",
        dropoffLocation: "Destination",
        navigateToPickup: "Navigate to Pickup",
        navigateToDropoff: "Navigate to Dropoff",
        startRide: "Start Ride",
        completeRide: "Complete Ride",
        cancelRide: "Cancel Ride",
        rideStarted: "Ride has started!",
        rideCompleted: "Ride completed!",
        errorUpdating: "Error updating status.",
        rideCancelled: "Ride has been cancelled.",
    }
}

export function InProgressRide() {
  const { activeRide, completeRide: completeRideInContext, cancelRide: cancelRideInContext } = useRide();
  const [rideStage, setRideStage] = useState<'pickup' | 'dropoff'>('pickup');
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  useEffect(() => {
    if (activeRide?.status === 'in_progress') {
        setRideStage('dropoff');
    } else {
        setRideStage('pickup');
    }
  }, [activeRide?.status]);


  if (!activeRide) {
    return null;
  }
  
  const { id, pickup, dropoff, customerName, rider } = activeRide;
  const riderInfo = rider || { name: customerName, rating: 4.8, phone: '+923011112222', avatarUrl: `https://picsum.photos/seed/${customerName}/100/100` };
  
  const handleCall = () => {
    if (riderInfo?.phone) {
      window.location.href = `tel:${riderInfo.phone}`;
    }
  };
  
  const handleNavigate = () => {
    // In a real app, you would open Google Maps or another navigation app.
    const destination = rideStage === 'pickup' ? pickup : dropoff;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, '_blank');
  };
  
  const handleUpdateStatus = async (status: RideRequest['status']) => {
      try {
        const rideRef = doc(db, "rides", id);
        await updateDoc(rideRef, { status });

        if(status === 'in_progress'){
            toast({ title: t.rideStarted });
        } else if (status === 'completed') {
            completeRideInContext();
            toast({ title: t.rideCompleted });
        } else if (status === 'cancelled_by_driver') {
            cancelRideInContext();
            toast({ title: t.rideCancelled, variant: 'destructive' });
        }
      } catch (error) {
          console.error("Error updating ride status: ", error);
          toast({ variant: "destructive", title: t.errorUpdating });
      }
  }
  
  const mapMarkers = [
    { position: [mockCoordinates.customer[0], mockCoordinates.customer[1]], popupText: 'Customer Location', icon: customerIcon },
    { position: [mockCoordinates.driver[0], mockCoordinates.driver[1]], popupText: 'Your Location', icon: carIcon }
  ];


  return (
    <div className="flex flex-col gap-4 items-start h-full">
      <div className="w-full h-48 md:h-64 bg-muted/50 rounded-lg border overflow-hidden">
         <DynamicMap markers={mapMarkers} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Card>
          <CardHeader className='pb-3'>
             <div className="flex items-center justify-between">
                <CardTitle>{t.riderInfo}</CardTitle>
                <Badge variant="secondary" className="text-md py-1 px-3 shadow-sm">
                    {rideStage === 'pickup' ? t.toPickup : t.toDropoff}
                </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={riderInfo?.avatarUrl} data-ai-hint="portrait woman" />
                        <AvatarFallback>
                        {riderInfo?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xl font-bold">{riderInfo?.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{riderInfo?.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleCall}>
                        <Phone className="h-5 w-5" />
                    </Button>
                    <ChatDialog riderName={riderInfo?.name || 'Rider'} />
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
                  <Button size="lg" className="w-full" onClick={() => handleUpdateStatus('in_progress')}>
                    {t.startRide}
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        
        <div className='space-y-2'>
            <Button size="lg" className="w-full" onClick={() => handleUpdateStatus('completed')} disabled={rideStage === 'pickup'}>
                {t.completeRide}
            </Button>
             <Button variant="destructive" size="lg" className="w-full" onClick={() => handleUpdateStatus('cancelled_by_driver')}>
                <X className="mr-2 h-5 w-5" />
                {t.cancelRide}
            </Button>
        </div>

      </div>
    </div>
  );
}
