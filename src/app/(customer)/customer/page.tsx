
'use client';

import { useState } from 'react';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";

type PageState = 'booking' | 'rides_available' | 'confirmed';

export default function CustomerPage() {
    const [pageState, setPageState] = useState<PageState>('booking');

    const handleFindRide = () => {
        setPageState('rides_available');
    };

    const handleConfirmRide = () => {
        setPageState('confirmed');
    };

    const handleCancelRide = () => {
        setPageState('booking');
    }
    
    if (pageState === 'confirmed') {
        return <CustomerRideStatus onCancel={handleCancelRide} />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
            <div className="flex-1 flex flex-col justify-center items-center">
                 {pageState === 'booking' && <RideBookingForm onFindRide={handleFindRide} />}
                 {pageState === 'rides_available' && <AvailableRides onConfirmRide={handleConfirmRide} />}
            </div>
        </div>
    );
}
