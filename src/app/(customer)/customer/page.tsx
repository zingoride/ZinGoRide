
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { CustomerInvoice } from '@/components/customer-invoice';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(() => import('@/components/dynamic-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
});

const CustomerPage = () => {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

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
        });

        return () => unsubscribe();
    }, [rideId]);
    

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

    const renderBookingStage = () => {
        if (!currentRide) {
            return (
                <Card className="shadow-lg rounded-2xl border-t-4 border-primary w-full h-full flex flex-col">
                    <CardContent className="p-4 flex-1 flex flex-col justify-center">
                        <RideBookingForm onFindRide={handleFindRide} />
                    </CardContent>
                </Card>
            );
        }
        
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        
        // This is the key change: Show AvailableRides only after a ride has been created ('pending' status)
        // and before it's confirmed ('booked')
        if (currentRide.status === 'pending') {
             return <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
        }
        
        return <CustomerRideStatus ride={currentRide} onCancel={handleReset} />;
    }

    if (!isClient) {
        return <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
     if (currentRide && (currentRide.status === 'accepted' || currentRide.status === 'in_progress')) {
        return <CustomerRideStatus ride={currentRide} onCancel={handleReset} />;
     }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-muted/30">
            <div className="w-full max-w-md">
                {renderBookingStage()}
            </div>
        </div>
    );
}

export default CustomerPage;
