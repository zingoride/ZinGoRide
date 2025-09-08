
'use client';

import { useState, useEffect } from 'react';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { CustomerInvoice } from '@/components/customer-invoice';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { AdBanner } from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { useLocationPermission } from '@/context/LocationPermissionContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    enableLocationTitle: "Location Ki Ijazat Zaroori Hai",
    enableLocationDesc: "Behtareen tajurbe ke liye aur apni maujooda location se ride book karne ke liye, baraye meharbani location services ko enable karein.",
    enableLocationBtn: "Location Enable Karein",
    enabling: "Enabling...",
    rideRequestError: "Ride request karne mein masla hua.",
  },
  en: {
    enableLocationTitle: "Location Permission Required",
    enableLocationDesc: "For the best experience and to book rides from your current location, please enable location services.",
    enableLocationBtn: "Enable Location",
    enabling: "Enabling...",
    rideRequestError: "Error requesting ride.",
  }
}


const CustomerPage = () => {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    
    const { hasPermission, requestPermission, isCheckingPermission } = useLocationPermission();
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        setIsClient(true);
        const savedRideId = localStorage.getItem('activeRideId');
        if (savedRideId) {
            setRideId(savedRideId);
        }
    }, []);

    useEffect(() => {
        if (!rideId) {
            setCurrentRide(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('activeRideId');
            }
            return;
        }
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeRideId', rideId);
        }

        const rideRef = doc(db, "rides", rideId);
        const unsubscribe = onSnapshot(rideRef, (doc) => {
            if (doc.exists()) {
                const rideData = { id: doc.id, ...doc.data() } as RideRequest;
                if (rideData.status === 'cancelled_by_customer') {
                    handleReset();
                } else {
                    setCurrentRide(rideData);
                }
            } else {
                handleReset();
            }
        }, (error) => {
            console.error("Error listening to ride document:", error);
            toast({ variant: 'destructive', title: "Database Error", description: "Could not fetch ride updates." });
        });

        return () => unsubscribe();
    }, [rideId, toast]);
    

    const handleFindRide = (ride: RideRequest) => {
        setRideId(ride.id);
        setCurrentRide(ride);
    };
    
    const handleReset = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('activeRideId');
        }
        setCurrentRide(null);
        setRideId(null);
    };

    if (!isClient || isCheckingPermission) {
        return <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
    if (!hasPermission) {
        return (
            <div className="h-full w-full flex items-start justify-center pt-8">
                <Card className="shadow-lg w-full max-w-md">
                    <CardHeader className="text-center">
                        <MapPin className="h-12 w-12 mx-auto text-primary" />
                        <CardTitle className="mt-4">{t.enableLocationTitle}</CardTitle>
                        <CardDescription>{t.enableLocationDesc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            className="w-full" 
                            onClick={requestPermission} 
                            disabled={isCheckingPermission}
                        >
                            {isCheckingPermission ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isCheckingPermission ? t.enabling : t.enableLocationBtn}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />;
        }
        
        if (currentRide.status === 'pending') {
             return (
                 <div className="h-full w-full flex items-start justify-center">
                     <div className="w-full max-w-md">
                        <Card className="shadow-lg w-full">
                            <CardContent className="p-4">
                                <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
                            </CardContent>
                        </Card>
                     </div>
                 </div>
            );
        }

        // For accepted, in_progress, booked
        return <CustomerRideStatus ride={currentRide} onCancel={handleReset} />;
    }

    // Default view: Ride booking form
    return (
       <div className="h-full w-full flex items-start justify-center">
            <div className="w-full max-w-md">
                 <Card className="shadow-lg w-full">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <RideBookingForm 
                                onFindRide={handleFindRide} 
                            />
                            <AdBanner targetAudience="Customer" />
                        </div>
                    </CardContent>
                </Card>
            </div>
       </div>
    );
}

export default CustomerPage;
