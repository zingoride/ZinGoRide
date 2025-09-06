
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { CustomerInvoice } from '@/components/customer-invoice';
import { Card } from '@/components/ui/card';

export default function CustomerPage() {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);

    useEffect(() => {
        if (!rideId) return;

        // Mocking the Firestore listener
        const ride = currentRide;
        if (ride) {
            // Simulate ride status changes for mock data
            const t1 = setTimeout(() => {
                setCurrentRide(prev => prev ? {...prev, status: 'accepted'} : null);
            }, 6000);
            const t2 = setTimeout(() => {
                setCurrentRide(prev => prev ? {...prev, status: 'in_progress'} : null);
            }, 12000);
             const t3 = setTimeout(() => {
                setCurrentRide(prev => prev ? {...prev, status: 'completed'} : null);
            }, 18000);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            }
        }
    }, [rideId, currentRide]);
    

    const handleFindRide = (ride: RideRequest) => {
        setRideId(ride.id);
        // Simulate Firestore latency
        setTimeout(() => {
            setCurrentRide(ride);
        }, 500);
    };
    
    const handleReset = () => {
        setCurrentRide(null);
        setRideId(null);
    };

    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        // 'pending' state is when AvailableRides is shown
        if (currentRide.status === 'pending') {
             return (
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                    <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
                </div>
             )
        }
        // 'accepted', 'in_progress', etc.
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
