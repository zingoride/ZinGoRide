
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { RideRequest } from '@/lib/types';
import { Badge } from './ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const translations = {
  ur: {
    title: "Safar Mukammal!",
    rideId: "Ride ID",
    driver: "Driver",
    fare: "Kiraya",
    tip: "Tip",
    total: "Kul Raqam",
    paymentMethod: "Cash Payment",
    done: "Ho Gaya",
    howWasRide: "Aapka safar kaisa tha?",
    rateDriver: "Driver ko rate karein",
    addComment: "Koi tabsira likhein...",
    submitFeedback: "Feedback Jama Karein",
    rideCancelled: "Ride Cancelled",
    rideCancelledDesc: "Yeh ride driver ne cancel kar di thi."
  },
  en: {
    title: "Ride Complete!",
    rideId: "Ride ID",
    driver: "Driver",
    fare: "Fare",
    tip: "Tip",
    total: "Total Amount",
    paymentMethod: "Cash Payment",
    done: "Done",
    howWasRide: "How was your ride?",
    rateDriver: "Rate your driver",
    addComment: "Add a comment...",
    submitFeedback: "Submit Feedback",
    rideCancelled: "Ride Cancelled",
    rideCancelledDesc: "This ride was cancelled by the driver."
  },
};

export function CustomerInvoice({ ride, onDone }: { ride: RideRequest, onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [comment, setComment] = useState("");
  const { language } = useLanguage();
  const t = translations[language];

  const total = (ride.fare || 0) + tip;

  const handleSubmit = async () => {
    try {
      const rideRef = doc(db, "rides", ride.id);
      await updateDoc(rideRef, {
        rating: rating,
        tip: tip,
        feedback: comment,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
    onDone();
  };

  if (ride.status === 'cancelled_by_driver') {
    return (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onDone()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.rideCancelled}</DialogTitle>
                    <DialogDescription>{t.rideCancelledDesc}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onDone} className="w-full">{t.done}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && handleSubmit()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className='flex flex-col items-center text-center'>
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <DialogTitle className="text-2xl">{t.title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="text-center">
            <h3 className='font-semibold'>{t.howWasRide}</h3>
            <p className='text-sm text-muted-foreground'>{ride.driverName || "Driver"}</p>
          </div>
          
          <div className='flex justify-center gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                    key={star} 
                    className={cn("h-8 w-8 cursor-pointer", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
                    onClick={() => setRating(star)}
                />
            ))}
          </div>

          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.fare}</span>
              <span>PKR {(ride.fare || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t.tip}</span>
              <div className='flex gap-2'>
                {[0, 50, 100, 150].map(tipAmount => (
                    <Button 
                        key={tipAmount}
                        variant={tip === tipAmount ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTip(tipAmount)}
                    >
                       PKR {tipAmount}
                    </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>{t.total}</span>
            <span>PKR {total.toFixed(2)}</span>
          </div>
           <div className='flex justify-center'>
             <Badge>{t.paymentMethod}</Badge>
          </div>

          <div>
            <Textarea placeholder={t.addComment} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full" size="lg">
            {t.submitFeedback}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
