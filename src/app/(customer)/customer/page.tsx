
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { CustomerInvoice } from '@/components/customer-invoice';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';

export default function CustomerPage() {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);

    useEffect(() => {
        // Attempt to load rideId from localStorage on initial load
        const savedRideId = localStorage.getItem('activeRideId');
        if (savedRideId) {
            setRideId(savedRideId);
        }
    }, []);

    useEffect(() => {
        if (!rideId) {
            localStorage.removeItem('activeRideId');
            return;
        }

        localStorage.setItem('activeRideId', rideId);
        const rideRef = doc(db, "rides", rideId);
        const unsubscribe = onSnapshot(rideRef, (doc) => {
            if (doc.exists()) {
                setCurrentRide({ id: doc.id, ...doc.data() } as RideRequest);
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
        localStorage.removeItem('activeRideId');
        setCurrentRide(null);
        setRideId(null);
    };

    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        // 'pending' is before vehicle selection.
        if (currentRide.status === 'pending') {
             return (
                 <div className="relative w-full h-full">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://picsum.photos/seed/customermap/1200/900"
                            alt="City map background"
                            fill
                            style={{objectFit: 'cover'}}
                            className="opacity-90"
                            data-ai-hint="street map aerial"
                        />
                         <div className="absolute inset-0 bg-background/20 backdrop-blur-sm"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                        <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
                    </div>
                 </div>
             )
        }
        // 'booked', 'accepted', 'in_progress', etc. will now show the status screen
        return <div className='h-full md:h-[calc(100vh-4rem)]'><CustomerRideStatus ride={currentRide} onCancel={handleReset} /></div>;
    }

    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://picsum.photos/seed/customermap/1200/900"
                    alt="City map background"
                    fill
                    style={{objectFit: 'cover'}}
                    data-ai-hint="street map aerial"
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                 <Card className="shadow-lg rounded-t-2xl">
                    <CardContent className="p-4">
                        <RideBookingForm onFindRide={handleFindRide} />
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}
