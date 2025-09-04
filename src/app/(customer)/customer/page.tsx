
'use client';

import { useState, useEffect } from 'react';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerInvoice } from '@/components/customer-invoice';

export default function CustomerPage() {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);

    useEffect(() => {
        if (!rideId) return;

        const unsub = onSnapshot(doc(db, "rides", rideId), (doc) => {
            if (doc.exists()) {
                setCurrentRide({ id: doc.id, ...doc.data() } as RideRequest);
            } else {
                // Ride document might have been deleted
                setCurrentRide(null);
                setRideId(null);
            }
        });

        // Cleanup subscription on unmount
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
        return <div className='h-full md:h-[calc(100vh-8rem)]'><CustomerRideStatus ride={currentRide} onCancel={handleReset} /></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 md:p-8">
            <RideBookingForm onFindRide={handleFindRide} />
        </div>
    );
}
