
'use client';

import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { RideBookingForm } from "@/components/ride-booking-form";
import { AvailableRides } from "@/components/available-rides";
import { CustomerRideStatus } from "@/components/customer-ride-status";
import type { RideRequest } from '@/lib/types';
import { CustomerInvoice } from '@/components/customer-invoice';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Skeleton } from '@/components/ui/skeleton';

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
            localStorage.removeItem('activeRideId');
            return;
        }

        localStorage.setItem('activeRideId', rideId);
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
        localStorage.removeItem('activeRideId');
        setCurrentRide(null);
        setRideId(null);
    };

    const renderMap = () => {
        if(!isClient) return <Skeleton className="w-full h-full bg-muted animate-pulse" />;
        
        return (
            <MapContainer center={[24.9, 67.1]} zoom={12} scrollWheelZoom={false} style={{height: '100%', width: '100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        )
    }

    if (currentRide) {
        if (currentRide.status === 'completed' || currentRide.status === 'cancelled_by_driver') {
            return <CustomerInvoice ride={currentRide} onDone={handleReset} />
        }
        
        if (currentRide.status === 'pending' || currentRide.status === 'booked') {
             return (
                 <div className="relative w-full h-full">
                    <div className="absolute inset-0 z-0">
                        {renderMap()}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                        <AvailableRides ride={currentRide} onConfirm={(confirmedRide) => setCurrentRide(confirmedRide)} />
                    </div>
                 </div>
             )
        }
        
        return <div className='h-full md:h-[calc(100vh-4rem)]'><CustomerRideStatus ride={currentRide} onCancel={handleReset} /></div>;
    }

    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 z-0">
                {renderMap()}
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

export default CustomerPage;
