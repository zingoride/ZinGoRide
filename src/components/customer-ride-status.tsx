
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Star, Car, X, MapPin, Navigation, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ChatDialog } from './chat-dialog';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, onSnapshot, GeoPoint, getDoc } from 'firebase/firestore';
import type { RideRequest } from '@/lib/types';
import L from 'leaflet';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';

const DynamicMap = dynamic(() => import('@/components/dynamic-map'), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
});

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

const defaultPositions = {
    driver: [24.88, 67.05] as [number, number],
    customer: [24.8607, 67.0011] as [number, number]
};

interface DriverDetails {
    rating: number;
    vehicle?: {
        make: string;
        model: string;
        licensePlate: string;
    };
}

const translations = {
    ur: {
        rideStatus: "Ride Status",
        findingDesc: "Aapke liye behtareen ride dhoondi ja rahi hai...",
        acceptedDesc: (eta: string) => `Aapka driver ${eta} mein pohnch raha hai.`,
        enrouteDesc: "Aap apne manzil ke raaste par hain.",
        findingDriver: "Driver dhoonda ja raha hai...",
        findingNewDriver: "Dosra driver dhoonda ja raha hai...",
        driverInfo: "Driver Ki Maloomat",
        rideDetails: "Safar Ki Tafseelat",
        pickup: "Uthanay ki Jagah",
        dropoff: "Manzil",
        actions: "Actions",
        call: "Call",
        cancelRide: "Ride Cancel Karein",
        cancelling: "Cancelling...",
        toastDriverAcceptedTitle: "Driver Rastay Mein Hai!",
        toastDriverAcceptedDesc: (name: string) => `${name} aapko lene aa raha hai.`,
        toastRideStartedTitle: "Safar Shuru!",
        toastRideStartedDesc: "Aapka safar shuru ho gaya hai.",
    },
    en: {
        rideStatus: "Ride Status",
        findingDesc: "Finding the best ride for you...",
        acceptedDesc: (eta: string) => `Your driver is arriving in ${eta}.`,
        enrouteDesc: "You are on the way to your destination.",
        findingDriver: "Finding a driver...",
        findingNewDriver: "Finding another driver...",
        driverInfo: "Driver Information",
        rideDetails: "Ride Details",
        pickup: "Pickup",
        dropoff: "Destination",
        actions: "Actions",
        call: "Call",
        cancelRide: "Cancel Ride",
        cancelling: "Cancelling...",
        toastDriverAcceptedTitle: "Driver on the way!",
        toastDriverAcceptedDesc: (name: string) => `${name} is coming to pick you up.`,
        toastRideStartedTitle: "Ride Started!",
        toastRideStartedDesc: "Your trip is now in progress.",
    }
};

export function CustomerRideStatus({ ride, onCancel }: { ride: RideRequest, onCancel: () => void }) {
    const [progress, setProgress] = useState(10);
    const [loading, setLoading] = useState(false);
    const [showExtendedSearch, setShowExtendedSearch] = useState(false);
    const { language } = useLanguage();
    const { toast } = useToast();
    const t = translations[language];
    const { id, status, driverId, driverName, driverAvatar, pickup, dropoff } = ride;
    
    const prevStatusRef = useRef<RideRequest['status']>();
    const [driverPosition, setDriverPosition] = useState<[number, number] | null>(null);
    const [customerPosition, setCustomerPosition] = useState<[number, number] | null>(null);
    const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);


    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerPosition([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.warn("Could not get customer's geolocation.");
          const pickupGeo = ride.pickupCoords;
          setCustomerPosition(pickupGeo ? [pickupGeo.latitude, pickupGeo.longitude] : defaultPositions.customer);
        }
      );
    }, [ride.pickupCoords]);

    useEffect(() => {
        if (!driverId) return;

        const driverRef = doc(db, "users", driverId);
        const unsubscribe = onSnapshot(driverRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.location instanceof GeoPoint) {
                    setDriverPosition([data.location.latitude, data.location.longitude]);
                }
                setDriverDetails({
                    rating: data.rating || 5.0, // Default rating
                    vehicle: data.vehicle || { make: 'Toyota', model: 'Corolla', licensePlate: 'ABC-123' }
                });
            }
        });

        return () => unsubscribe();
    }, [driverId]);


    useEffect(() => {
        let progressTimer: NodeJS.Timeout | null = null;
        let extendedSearchTimer: NodeJS.Timeout | null = null;

        if (status === 'pending') {
            setShowExtendedSearch(false);
            setProgress(10);
            
            progressTimer = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + 5 : prev));
            }, 500);
            
            extendedSearchTimer = setTimeout(() => {
                setShowExtendedSearch(true);
            }, 10000); // 10 seconds

        }

        return () => {
            if (progressTimer) clearInterval(progressTimer);
            if (extendedSearchTimer) clearTimeout(extendedSearchTimer);
        }
    }, [status]);
    
    useEffect(() => {
        const previousStatus = prevStatusRef.current;
        if (previousStatus !== status) {
            if (status === 'accepted') {
                toast({
                    title: t.toastDriverAcceptedTitle,
                    description: t.toastDriverAcceptedDesc(driverName || 'Your Driver'),
                });
            } else if (status === 'in_progress') {
                 toast({
                    title: t.toastRideStartedTitle,
                    description: t.toastRideStartedDesc,
                });
            }
        }
        prevStatusRef.current = status;

    }, [status, driverName, t, toast]);


    const handleCall = () => {
        window.location.href = `tel:+923001234567`;
    };
    
    const handleCancelRide = async () => {
        setLoading(true);
        try {
            const rideRef = doc(db, "rides", ride.id);
            await updateDoc(rideRef, {
                status: 'cancelled_by_customer',
            });
            // onCancel will be called by the parent component's onSnapshot listener
        } catch (error) {
            console.error("Error cancelling ride: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = () => {
        const eta = "5 minutes";
        switch(status) {
            case 'pending':
                 return { title: t.rideStatus, description: t.findingDesc };
            case 'accepted':
                 return { title: t.rideStatus, description: t.acceptedDesc(eta) };
            case 'in_progress':
                 return { title: t.rideStatus, description: t.enrouteDesc };
            default:
                 return { title: t.rideStatus, description: t.findingDesc };
        }
    }
    
    const mapMarkers = useMemo(() => {
        const markers = [];
        if(customerPosition) {
            markers.push({ position: customerPosition, popupText: 'Your Location', icon: customerIcon });
        }
        if(driverPosition) {
             markers.push({ position: driverPosition, popupText: 'Driver Location', icon: carIcon });
        }
        return markers;
    }, [customerPosition, driverPosition]);
    

    const { title, description } = getStatusInfo();
    const showDriverDetails = status === 'accepted' || status === 'in_progress';
    const currentDriverName = driverName || "Finding Driver...";
    const currentDriverAvatar = driverAvatar || undefined;

    const renderCardContent = () => {
        if (!showDriverDetails) {
            return (
                <div className="flex flex-col justify-center items-center gap-6 text-center h-full p-8">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <p className='font-semibold text-lg'>{showExtendedSearch ? t.findingNewDriver : t.findingDriver}</p>
                    <Progress value={progress} className='w-full' />
                    {showExtendedSearch && (
                         <Button variant="destructive" className="w-full mt-4" onClick={handleCancelRide} disabled={loading}>
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.cancelling}</>
                            ) : (
                                <><X className="mr-2 h-4 w-4" /> {t.cancelRide}</>
                            )}
                        </Button>
                    )}
                </div>
            )
        }

        return (
             <div className="p-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={currentDriverAvatar} alt={currentDriverName} data-ai-hint="portrait man" />
                        <AvatarFallback>{currentDriverName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                        <p className="text-xl font-bold">{currentDriverName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{driverDetails?.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                    </div>
                     <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={handleCall}>
                            <Phone className="h-4 w-4" />
                        </Button>
                        {driverId && (
                            <ChatDialog 
                                rideId={id}
                                chatPartnerName={driverName || "Driver"}
                                chatPartnerId={driverId}
                                trigger={<Button variant="outline" size="icon"><MessageSquare className="h-4 w-4" /></Button>}
                            />
                        )}
                    </div>
                </div>

                <Separator className="my-4" />
                
                {driverDetails?.vehicle && (
                <Card className='w-full bg-muted/50 border-dashed mb-4'>
                    <CardContent className='p-3'>
                        <div className="flex items-center justify-center gap-2">
                            <Car className='h-6 w-6' />
                            <p className="text-md font-semibold">{driverDetails.vehicle.make} {driverDetails.vehicle.model} - {driverDetails.vehicle.licensePlate}</p>
                        </div>
                    </CardContent>
                </Card>
                )}


                 <Button variant="destructive" className="w-full" onClick={handleCancelRide} disabled={loading}>
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.cancelling}</>
                    ) : (
                        <><X className="mr-2 h-4 w-4" /> {t.cancelRide}</>
                    )}
                </Button>
            </div>
        )

    }

    return (
       <div className="flex flex-col h-full w-full gap-4">
            <div className="h-96 w-full rounded-lg overflow-hidden border">
                 <DynamicMap markers={mapMarkers} />
            </div>
            <Card className="shadow-lg rounded-2xl w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {renderCardContent()}
                </CardContent>
            </Card>
       </div>
    );
}
