
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
import { AdBanner } from '@/components/ad-banner';
import { useIsMobile } from '@/hooks/use-mobile';

const DynamicMap = dynamic(() => import('@/components/dynamic-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
});

const CustomerPage = () => {
    const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
    const [rideId, setRideId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const isMobile = useIsMobile();

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

    const renderContent = () => {
        if (!currentRide) {
            return (
                <div className="space-y-4">
                    <RideBookingForm onFindRide={handleFindRide} />
                    <AdBanner targetAudience="Customer" />
                </div>
            );
        }
        
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        
        if (currentRide.status === 'pending') {
             return <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
        }
        
        // For 'accepted', 'in_progress', 'booked' statuses, the map is shown full screen
        return null;
    }

    if (!isClient) {
        return <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }
    
     if (currentRide && (currentRide.status === 'accepted' || currentRide.status === 'in_progress' || currentRide.status === 'booked')) {
        return <CustomerRideStatus ride={currentRide} onCancel={handleReset} />;
     }

    return (
       <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="md:col-span-1">
                 <Card className="shadow-lg w-full">
                    <CardContent className="p-4">
                        {renderContent()}
                    </CardContent>
                </Card>
            </div>
            <div className="relative md:col-span-1 h-96 md:h-[500px] rounded-lg overflow-hidden border">
                <DynamicMap />
            </div>
       </div>
    );
}

export default CustomerPage;
