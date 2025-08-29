
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Star, User, Car, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ChatDialog } from './chat-dialog';
import Image from 'next/image';

const driverDetails = {
    name: 'Ali Khan',
    rating: 4.9,
    vehicle: 'Toyota Corolla - ABC-123',
    eta: '5 minutes',
    avatar: 'https://picsum.photos/100/100?random=driver',
    phone: '+923001234567'
}

export function CustomerRideStatus({ onCancel }: { onCancel: () => void }) {
    const [status, setStatus] = useState<'finding' | 'enroute'>('finding');
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        if (status === 'finding') {
            const timer = setTimeout(() => {
                setStatus('enroute');
            }, 4000); // Simulate finding a driver for 4 seconds
            
            const progressTimer = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + 15 : prev));
            }, 500);

            return () => {
                clearTimeout(timer);
                clearInterval(progressTimer);
            }
        }
    }, [status]);

    const handleCall = () => {
        if (driverDetails.phone) {
            window.location.href = `tel:${driverDetails.phone}`;
        }
    };

    const mapImageUrl = status === 'enroute' 
        ? "https://picsum.photos/seed/driver-route/800/600"
        : "https://picsum.photos/seed/customermap/800/600";
    
    const mapImageHint = status === 'enroute' ? "map with driver route" : "city map";


    return (
        <div className="flex flex-col h-full">
             <div className="flex-1 bg-muted flex items-center justify-center p-4">
                 <div className="w-full h-full relative shadow-lg rounded-lg overflow-hidden">
                    <Image
                        src={mapImageUrl}
                        alt="Map of city"
                        fill
                        style={{objectFit:"cover"}}
                        data-ai-hint={mapImageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <p className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-md">Live Map Placeholder</p>
                    </div>
                </div>
            </div>
            <Card className="w-full h-full flex flex-col rounded-t-2xl -mt-4 z-10">
                <CardHeader>
                    <CardTitle>Ride Status</CardTitle>
                    <CardDescription>
                        {status === 'finding' ? 'Aapke liye behtareen ride dhoondi ja rahi hai...' : `Aapka driver ${driverDetails.eta} mein pohnch raha hai.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center gap-6 text-center">
                    {status === 'finding' ? (
                        <>
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                            <p className='font-semibold text-lg'>Driver dhoonda ja raha hai...</p>
                            <Progress value={progress} className='w-full max-w-sm' />

                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24 border-4 border-primary">
                                <AvatarImage src={driverDetails.avatar} alt={driverDetails.name} data-ai-hint="portrait man" />
                                <AvatarFallback>{driverDetails.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='text-center'>
                                <p className="text-2xl font-bold">{driverDetails.name}</p>
                                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{driverDetails.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        
                            <Card className='w-full bg-muted/50'>
                                <CardContent className='p-3'>
                                    <div className="flex items-center justify-center gap-2">
                                        <Car className='h-6 w-6' />
                                        <p className="text-lg font-semibold">{driverDetails.vehicle}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex w-full gap-2 mt-4">
                                <Button variant="outline" className="w-full" onClick={handleCall}>
                                    <Phone className="mr-2 h-4 w-4" /> Call
                                </Button>
                                <ChatDialog riderName={driverDetails.name} />
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className='p-4 border-t'>
                    <Button variant="destructive" className="w-full" onClick={onCancel}>
                        <X className="mr-2 h-4 w-4" /> Ride Cancel Karein
                    </Button>
                </div>
            </Card>
        </div>
    )
}
