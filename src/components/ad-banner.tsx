
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';
import { Megaphone, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

interface Advertisement {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    targetUrl: string;
    isActive: boolean;
}

export function AdBanner() {
    const [ad, setAd] = useState<Advertisement | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adsCollection = collection(db, "advertisements");
        const q = query(adsCollection, where("isActive", "==", true), limit(1));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const adData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Advertisement;
                setAd(adData);
                setIsVisible(true); // Show banner when a new ad is fetched
            } else {
                setAd(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading || !ad || !isVisible) {
        return null; // Don't render anything if loading, no ad, or dismissed
    }

    const handleAdClick = () => {
        window.open(ad.targetUrl, '_blank');
    };

    return (
        <div className="w-full p-2">
             <Card className="overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.02] relative" onClick={handleAdClick}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        setIsVisible(false);
                    }} 
                    className="absolute top-1 right-1 z-10 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                    <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-4">
                    <Image src={ad.imageUrl} alt={ad.title} width={120} height={100} className="object-cover h-full"/>
                    <div className="py-2 pr-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Megaphone className="h-4 w-4" />
                            <p className="text-xs font-bold uppercase tracking-wider">{ad.title}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-1">{ad.description}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

