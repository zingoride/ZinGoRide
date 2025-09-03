
'use client';

import { useState } from 'react';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';

type PageState = 'booking' | 'rides_available' | 'confirmed';

export default function CustomerPage() {
    const [pageState, setPageState] = useState<PageState>('booking');
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);

    const handleFindRide = (rideDetails: RideRequest) => {
        setCurrentRide(rideDetails);
        setPageState('rides_available');
    };

    const handleConfirmRide = () => {
        setPageState('confirmed');
    };

    const handleCancelRide = () => {
        setPageState('booking');
        setCurrentRide(null);
    }
    
    if (pageState === 'confirmed' && currentRide) {
        return <CustomerRideStatus ride={currentRide} onCancel={handleCancelRide} />;
    }

    if (pageState === 'rides_available' && currentRide) {
        return <AvailableRides ride={currentRide} onConfirmRide={handleConfirmRide} />
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
            <div className="flex-1 flex flex-col justify-center items-center">
                 <RideBookingForm onFindRide={handleFindRide} />
            </div>
        </div>
    );
}
