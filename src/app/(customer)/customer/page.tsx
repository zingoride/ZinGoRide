
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

    if (!isClient) {
        return <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        
        if (currentRide.status === 'booked') {
             return (
                <div className="relative w-full h-[calc(100vh-60px)]">
                    <div className='absolute inset-0'>
                        <DynamicMap />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 w-full p-4 z-10 max-w-md mx-auto">
                        <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
                    </div>
                 </div>
             )
        }
        
        // This will now render the 3-panel layout for accepted/in_progress rides
        return <CustomerRideStatus ride={currentRide} onCancel={handleReset} />;
    }

    return (
        <div className="relative h-full w-full flex flex-col">
            <div className="flex-grow">
                 <DynamicMap />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-background via-background/80 to-transparent">
                <div className="max-w-md mx-auto">
                     <Card className="shadow-lg rounded-2xl border-t-4 border-primary">
                        <CardContent className="p-4">
                            <RideBookingForm onFindRide={handleFindRide} />
                        </CardContent>
                     </Card>
                </div>
            </div>
        </div>
    );
}

export default CustomerPage;

