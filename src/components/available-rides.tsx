

'use client';

import { useState, useEffect } from 'react';
import { Car, Bike, PersonStanding, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import type { RideRequest } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, GeoPoint } from 'firebase/firestore';
import type { VehicleType } from '@/app/(admin)/admin/settings/page';
import { Skeleton } from './ui/skeleton';

const translations = {
    ur: {
        chooseRide: "Ride Chunein",
        eta: "Andazan waqt",
        seats: "seats",
        confirmRide: "Ride Confirm Karein",
        confirming: "Confirming...",
        rideConfirmedTitle: "Ride Confirmed!",
        rideConfirmedDesc: "Aapke liye driver dhoonda ja raha hai.",
        rideUpdateError: "Ride confirm karne mein masla hua.",
        loadingVehicles: "Gaariyan load ho rahi hain...",
        noVehicles: "Koi gaari dastyab nahi.",
        distanceError: "Fasla calculate nahi ho saka.",
        minutes: "min",
    },
    en: {
        chooseRide: "Choose a Ride",
        eta: "ETA",
        seats: "seats",
        confirmRide: "Confirm Ride",
        confirming: "Confirming...",
        rideConfirmedTitle: "Ride Confirmed!",
        rideConfirmedDesc: "Finding a driver for you.",
        rideUpdateError: "Error confirming ride.",
        loadingVehicles: "Loading vehicles...",
        noVehicles: "No vehicles available.",
        distanceError: "Could not calculate distance.",
        minutes: "min",
    }
}

interface AvailableRidesProps {
    ride: RideRequest;
}

interface VehicleOption extends VehicleType {
    calculatedFare: number;
    eta: number;
}

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (from: GeoPoint, to: GeoPoint) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export function AvailableRides({ ride }: AvailableRidesProps) {
  const [selectedVehicleName, setSelectedVehicleName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fetchAndCalculateFares = async () => {
        setVehiclesLoading(true);
        try {
            const configRef = doc(db, 'configs', 'appConfig');
            const configSnap = await getDoc(configRef);

            if (!configSnap.exists() || !configSnap.data().vehicleTypes) {
                setVehicleOptions([]);
                return;
            }

            const vehicleTypes: VehicleType[] = configSnap.data().vehicleTypes.filter((v: VehicleType) => v.active);

            if (!ride.pickupCoords || !ride.dropoffCoords) {
                 toast({ variant: 'destructive', title: t.distanceError });
                 return;
            }
            
            const distanceKm = getDistance(ride.pickupCoords, ride.dropoffCoords);
            const estimatedTimeMinutes = distanceKm * 2.5; // Rough estimation

            const calculatedOptions: VehicleOption[] = vehicleTypes.map(vehicle => {
                const distanceFare = vehicle.perKmRate * distanceKm;
                const timeFare = vehicle.perMinRate * estimatedTimeMinutes;
                const calculatedFare = vehicle.baseFare + distanceFare + timeFare;
                
                // Round to nearest 10 for simplicity
                const roundedFare = Math.round(calculatedFare / 10) * 10;
                
                return {
                    ...vehicle,
                    calculatedFare: roundedFare,
                    eta: Math.round(estimatedTimeMinutes + 5), // Add base ETA
                };
            });
            
            setVehicleOptions(calculatedOptions);
            if (calculatedOptions.length > 0) {
                setSelectedVehicleName(calculatedOptions[0].name);
            }

        } catch (error) {
            console.error("Error fetching vehicles or calculating fares: ", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not load vehicle options."});
        } finally {
            setVehiclesLoading(false);
        }
    };

    fetchAndCalculateFares();
  }, [ride.pickupCoords, ride.dropoffCoords, toast, t.distanceError]);

  const handleConfirmRide = async () => {
    if (!selectedVehicleName) return;
    setLoading(true);
    
    try {
        const rideRef = doc(db, "rides", ride.id);
        const selectedVehicleDetails = vehicleOptions.find(v => v.name === selectedVehicleName);
        
        const updateData = {
            vehicleType: selectedVehicleName,
            fare: selectedVehicleDetails?.calculatedFare || 0,
            status: 'booked',
        };

        await updateDoc(rideRef, updateData);

        toast({
            title: t.rideConfirmedTitle,
            description: t.rideConfirmedDesc,
        });

    } catch (error) {
        console.error("Error confirming ride: ", error);
        toast({ variant: "destructive", title: t.rideUpdateError });
    } finally {
        setLoading(false);
    } 
  };
  
  const renderSkeletons = () => (
      <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                <Skeleton className="h-[60px] w-[80px] rounded-md" />
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                       <Skeleton className="h-5 w-20" />
                       <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex justify-between">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            </div>
          ))}
      </div>
  );

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-center">{t.chooseRide}</h3>
          {vehiclesLoading ? renderSkeletons() : vehicleOptions.length > 0 ? (
            <div className="space-y-3">
                {vehicleOptions.map((option) => {
                    const Icon = option.icon === 'Bike' ? Bike : Car;
                    return (
                        <div
                            key={option.name}
                            className={cn(
                            'flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all',
                            selectedVehicleName === option.name
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-muted/50'
                            )}
                            onClick={() => setSelectedVehicleName(option.name)}
                        >
                            <Image
                            src={`https://picsum.photos/seed/${option.name}/200/150`}
                            alt={option.name}
                            width={80}
                            height={60}
                            className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className='flex items-center gap-2'>
                                    <Icon className="h-5 w-5" />
                                    <p className="font-bold text-md">{option.name}</p>
                                </div>
                                <p className="font-bold text-md">PKR {option.calculatedFare}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                <p>{t.eta}: {option.eta} {t.minutes}</p>
                                <p>1 {t.seats}</p> 
                            </div>
                            </div>
                        </div>
                    )
                })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">{t.noVehicles}</div>
          )}
          <Button className="w-full" size="lg" onClick={handleConfirmRide} disabled={loading || vehiclesLoading || !selectedVehicleName}>
             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t.confirming : t.confirmRide}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
