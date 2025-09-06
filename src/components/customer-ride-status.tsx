
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Star, Car, X, Map } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ChatDialog } from './chat-dialog';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { RideRequest } from '@/lib/types';

const driverDetails = {
    name: 'Ali Khan',
    rating: 4.9,
    vehicle: 'Toyota Corolla - ABC-123',
    etaUr: '5 minute',
    etaEn: '5 minutes',
    avatar: 'https://picsum.photos/100/100?random=driver',
    phone: '+923001234567'
}

const translations = {
    ur: {
        rideStatus: "Ride Status",
        findingDesc: "Aapke liye behtareen ride dhoondi ja rahi hai...",
        acceptedDesc: (eta: string) => `Aapka driver ${eta} mein pohnch raha hai.`,
        enrouteDesc: "Aap apne manzil ke raaste par hain.",
        findingDriver: "Driver dhoonda ja raha hai...",
        call: "Call",
        cancelRide: "Ride Cancel Karein",
        cancelling: "Cancelling...",
    },
    en: {
        rideStatus: "Ride Status",
        findingDesc: "Finding the best ride for you...",
        acceptedDesc: (eta: string) => `Your driver is arriving in ${eta}.`,
        enrouteDesc: "You are on the way to your destination.",
        findingDriver: "Finding a driver...",
        call: "Call",
        cancelRide: "Cancel Ride",
        cancelling: "Cancelling...",
    }
};

export function CustomerRideStatus({ ride, onCancel }: { ride: RideRequest, onCancel: () => void }) {
    const [progress, setProgress] = useState(10);
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const t = translations[language];
    const { status, driverName, driverAvatar } = ride;

    useEffect(() => {
        if (status === 'booked') {
            const progressTimer = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + 15 : prev));
            }, 700);

            return () => {
                clearInterval(progressTimer);
            }
        }
    }, [status]);

    const handleCall = () => {
        if (driverDetails.phone) {
            window.location.href = `tel:${driverDetails.phone}`;
        }
    };
    
    const handleCancelRide = async () => {
        setLoading(true);
        try {
            const rideRef = doc(db, "rides", ride.id);
            await updateDoc(rideRef, {
                status: 'cancelled_by_customer',
            });
        } catch (error) {
            console.error("Error cancelling ride: ", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = () => {
        const eta = language === 'ur' ? driverDetails.etaUr : driverDetails.etaEn;
        switch(status) {
            case 'booked':
                return { title: t.rideStatus, description: t.findingDesc };
            case 'accepted':
                 return { title: t.rideStatus, description: t.acceptedDesc(eta) };
            case 'in_progress':
                 return { title: t.rideStatus, description: t.enrouteDesc };
            default:
                 return { title: t.rideStatus, description: t.findingDesc };
        }
    }

    const { title, description } = getStatusInfo();
    const showDriverDetails = status === 'accepted' || status === 'in_progress';

    return (
        <div className="flex flex-col h-full w-full bg-background items-center justify-end">
            <Card className="w-full flex flex-col rounded-t-2xl z-10 border-t-4 border-primary shadow-2xl">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center gap-6 text-center">
                    {!showDriverDetails ? (
                        <>
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                            <p className='font-semibold text-lg'>{t.findingDriver}</p>
                            <Progress value={progress} className='w-full' />
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24 border-4 border-primary">
                                <AvatarImage src={driverAvatar || driverDetails.avatar} alt={driverName || driverDetails.name} data-ai-hint="portrait man" />
                                <AvatarFallback>{(driverName || driverDetails.name).charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='text-center'>
                                <p className="text-2xl font-bold">{driverName || driverDetails.name}</p>
                                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{driverDetails.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        
                            <Card className='w-full bg-muted/50 border-dashed'>
                                <CardContent className='p-3'>
                                    <div className="flex items-center justify-center gap-2">
                                        <Car className='h-6 w-6' />
                                        <p className="text-lg font-semibold">{driverDetails.vehicle}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex w-full gap-2 mt-4">
                                <Button variant="outline" className="w-full" onClick={handleCall}>
                                    <Phone className="mr-2 h-4 w-4" /> {t.call}
                                </Button>
                                <ChatDialog riderName={driverName || driverDetails.name} />
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className='p-4 border-t'>
                    <Button variant="destructive" className="w-full" onClick={handleCancelRide} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.cancelling}
                            </>
                        ) : (
                             <>
                                <X className="mr-2 h-4 w-4" /> {t.cancelRide}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
