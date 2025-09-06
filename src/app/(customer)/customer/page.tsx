
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
import { Button } from '@/components/ui/button';
import { Star, Tag, MapPin } from 'lucide-react';

export default function CustomerPage() {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);

    useEffect(() => {
        if (!rideId) return;

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
        setCurrentRide(null);
        setRideId(null);
    };

    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        // 'booked' state is when AvailableRides is shown (after 'pending' is created)
        if (currentRide.status === 'booked' || currentRide.status === 'pending') {
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
                    data-ai-hint="street map aerial"
                />
            </div>
            <div className="absolute top-0 left-0 right-0 z-10 p-4 space-y-4">
                 <RideBookingForm onFindRide={handleFindRide} />
                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Card className='shadow-lg'>
                        <CardContent className='p-3 flex items-center gap-3'>
                            <div className='p-2 bg-primary/10 rounded-lg'>
                                <Tag className='h-6 w-6 text-primary' />
                            </div>
                            <div>
                                <p className='font-bold'>Promotions</p>
                                <p className='text-sm text-muted-foreground'>Get discounts on your next ride</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className='shadow-lg'>
                        <CardContent className='p-3 flex items-center gap-3'>
                           <div className='p-2 bg-primary/10 rounded-lg'>
                                <Star className='h-6 w-6 text-primary' />
                            </div>
                            <div>
                                <p className='font-bold'>Saved Places</p>
                                <p className='text-sm text-muted-foreground'>Add your home or work for faster booking</p>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}
