'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
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
import { useToast } from '@/hooks/use-toast';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false, loading: () => <div className="w-full h-full bg-muted animate-pulse"></div> });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

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
        rideStarted: "Safar shuru ho gaya!",
        rideCompleted: "Safar mukammal ho gaya!",
        errorUpdating: "Status update karne mein masla hua.",
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
        rideStarted: "Ride has started!",
        rideCompleted: "Ride completed!",
        errorUpdating: "Error updating status.",
    }
}

export function InProgressRide() {
  const { activeRide, completeRide: completeRideInContext, cancelRide: cancelRideInContext } = useRide();
  const [isNavigating, setIsNavigating] = useState(false);
  const [rideStage, setRideStage] = useState<'pickup' | 'dropoff'>('pickup');
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => setL(leaflet));
    setIsNavigating(true);
  }, []);

  if (!activeRide) {
    return null;
  }
  
  const { pickup, dropoff, rider, customerName } = activeRide;
  const riderInfo = rider || { name: customerName, rating: 4.8, phone: '+923011112222', avatarUrl: 'https://picsum.photos/seed/sania/100/100' };
  
  const handleCall = () => {
    if (riderInfo?.phone) {
      window.location.href = `tel:${riderInfo.phone}`;
    }
  };
  
  const handleNavigate = () => {
    setIsNavigating(true);
  };
  
  const handleStartRide = () => {
    setRideStage('dropoff');
    setIsNavigating(true);
    toast({ title: t.rideStarted });
  }

  const handleCompleteRide = () => {
    completeRideInContext();
    toast({ title: t.rideCompleted });
  };

  const handleCancelRide = () => {
    cancelRideInContext();
  }

  const driverIcon = L ? new L.Icon({
      iconUrl: '/car-pin.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
  }) : null;

  const customerIcon = L ? new L.Icon({
      iconUrl: '/customer-pin.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
  }) : null;

  return (
    <div className="flex flex-col gap-8 items-start h-full">
      <div className="w-full h-[300px] rounded-lg overflow-hidden relative bg-muted flex flex-col items-center justify-center">
        <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="text-lg py-2 px-4 shadow-lg">
                 {rideStage === 'pickup' ? t.toPickup : t.toDropoff}
            </Badge>
        </div>
        <MapContainer center={[24.88, 67.06]} zoom={13} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {driverIcon && <Marker position={[24.86, 67.04]} icon={driverIcon} />}
            {customerIcon && <Marker position={[24.90, 67.08]} icon={customerIcon} />}
        </MapContainer>
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
                  <Button size="lg" className="w-full" onClick={handleStartRide}>
                    {t.startRide}
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        
        <div className='space-y-2'>
            <Button size="lg" className="w-full" onClick={handleCompleteRide} disabled={rideStage === 'pickup'}>
                {t.completeRide}
            </Button>
             <Button variant="destructive" size="lg" className="w-full" onClick={handleCancelRide}>
                <X className="mr-2 h-5 w-5" />
                {t.cancelRide}
            </Button>
        </div>

      </div>
    </div>
  );
}
