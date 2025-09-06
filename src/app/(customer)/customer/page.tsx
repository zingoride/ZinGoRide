
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerInvoice } from '@/components/customer-invoice';
import { Card } from '@/components/ui/card';

export default function CustomerPage() {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);

    useEffect(() => {
        if (!rideId) return;

        const unsub = onSnapshot(doc(db, "rides", rideId), (doc) => {
            if (doc.exists()) {
                setCurrentRide({ id: doc.id, ...doc.data() } as RideRequest);
            } else {
                setCurrentRide(null);
                setRideId(null);
            }
        });

        return () => unsub();
    }, [rideId]);
    

    const handleFindRide = (ride: RideRequest) => {
        setRideId(ride.id);
        setCurrentRide(ride);
    };
    
    const handleReset = () => {
        setCurrentRide(null);
        setRideId(null);
    };

    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        if (currentRide.status === 'pending') {
             return <AvailableRides ride={currentRide} />
        }
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
                    className="opacity-90"
                    data-ai-hint="street map aerial"
                />
                 <div className="absolute inset-0 bg-background/20 backdrop-blur-sm"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                <RideBookingForm onFindRide={handleFindRide} />
            </div>
        </div>
    );
}
