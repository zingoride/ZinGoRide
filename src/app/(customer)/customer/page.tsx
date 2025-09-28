

'use client';

import { useState, useEffect, useCallback } from 'react';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { CustomerInvoice } from '@/components/customer-invoice';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, getDoc, GeoPoint } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { AdBanner } from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    enableLocationTitle: "Location Ki Ijazat Zaroori Hai",
    enableLocationDesc: "Behtareen tajurbe ke liye aur apni maujooda location se ride book karne ke liye, baraye meharbani location services ko enable karein.",
    enableLocationBtn: "Location Enable Karein",
    enabling: "Enabling...",
    rideRequestError: "Ride request karne mein masla hua.",
    permissionDenied: "Aapne location ki ijazat nahi di. Baraye meharbani browser settings se isay enable karein.",
  },
  en: {
    enableLocationTitle: "Location Permission Required",
    enableLocationDesc: "For the best experience and to book rides from your current location, please enable location services.",
    enableLocationBtn: "Enable Location",
    enabling: "Enabling...",
    rideRequestError: "Error requesting ride.",
    permissionDenied: "You have denied location permission. Please enable it in your browser settings.",
  }
}

const CustomerPage = () => {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [isClient, setIsClient] = useState(false);
    
    const [hasPermission, setHasPermission] = useState(false);
    const [isCheckingPermission, setIsCheckingPermission] = useState(true);
    const [isEnablingLocation, setIsEnablingLocation] = useState(false);

    const { toast } = useToast();
    const { language } = useLanguage();
    const t = translations[language];

    const checkPermission = useCallback(async () => {
        if (!navigator.permissions) {
            setIsCheckingPermission(false);
            return;
        }
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permissionStatus.state === 'granted') {
                setHasPermission(true);
            }
            setIsCheckingPermission(false);
        } catch {
            setIsCheckingPermission(false);
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
        checkPermission();
        const savedRideId = localStorage.getItem('activeRideId');
        if (savedRideId) {
            // Immediately start listening to this ride
            handleFindRide(savedRideId);
        }
    }, [checkPermission]);

    useEffect(() => {
        if (!currentRide?.id) return;
        
        const rideRef = doc(db, "rides", currentRide.id);
        const unsubscribe = onSnapshot(rideRef, async (docSnap) => {
             if (docSnap.exists()) {
                const rideData = { id: docSnap.id, ...docSnap.data() } as RideRequest;
                 if (rideData.status === 'cancelled_by_customer' || rideData.status === 'completed' || rideData.status === 'cancelled_by_driver') {
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
            handleReset();
        });

        // Cleanup listener and ride on unmount/route change
        return () => {
            unsubscribe();
            const cancelRideOnUnmount = async () => {
                try {
                    const rideDoc = await getDoc(rideRef);
                    if (rideDoc.exists()) {
                        const rideData = rideDoc.data();
                        if (rideData.status === 'booked' || rideData.status === 'searching') {
                             await updateDoc(rideRef, { status: 'cancelled_by_customer' });
                             console.log(`Ride ${currentRide.id} cancelled due to component unmount.`);
                        }
                    }
                } catch (e) {
                    console.error("Error cancelling ride on unmount", e);
                }
            }
            cancelRideOnUnmount();
        };
    }, [currentRide?.id, toast]);
    

    const handleFindRide = (rideId: string) => {
        localStorage.setItem('activeRideId', rideId);
        // Set a minimal ride object to trigger the useEffect listener
        setCurrentRide({ id: rideId } as RideRequest);
    };
    
    const handleReset = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('activeRideId');
        }
        setCurrentRide(null);
    };
    
    const handleEnableLocation = () => {
        if (!navigator.geolocation) return;
        setIsEnablingLocation(true);
        navigator.geolocation.getCurrentPosition(
            () => {
                setHasPermission(true);
                setIsEnablingLocation(false);
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    toast({ variant: 'destructive', title: t.permissionDenied });
                }
                setIsEnablingLocation(false);
            }
        );
    }

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
                            onClick={handleEnableLocation} 
                            disabled={isEnablingLocation}
                        >
                            {isEnablingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isEnablingLocation ? t.enabling : t.enableLocationBtn}
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
        
        if (currentRide.status === 'searching') {
             return (
                 <div className="h-full w-full flex items-start justify-center">
                     <div className="w-full max-w-md">
                        <Card className="shadow-lg w-full">
                            <CardContent className="p-4">
                                <AvailableRides ride={currentRide} />
                            </CardContent>
                        </Card>
                     </div>
                 </div>
            );
        }

        return <CustomerRideStatus ride={currentRide} onCancel={handleReset} />;
    }

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
