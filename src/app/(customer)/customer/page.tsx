
'use client';

import { useState } from 'react';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import Image from "next/image";

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

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-1 bg-muted flex items-center justify-center p-4">
                 <div className="w-full h-full relative shadow-lg rounded-lg overflow-hidden">
                    <Image
                        src="https://picsum.photos/seed/customermap/1600/1200"
                        alt="Map of city"
                        fill
                        style={{objectFit:"cover"}}
                        data-ai-hint="city map"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <p className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-md">Live Map Placeholder</p>
                    </div>
                </div>
            </div>
            <div className="bg-background p-4 flex flex-col gap-4">
                {pageState === 'booking' && <RideBookingForm onFindRide={handleFindRide} />}
                {pageState === 'rides_available' && <AvailableRides onConfirmRide={handleConfirmRide} />}
                {pageState === 'confirmed' && <CustomerRideStatus onCancel={handleCancelRide} />}
            </div>
        </div>
    );
}
