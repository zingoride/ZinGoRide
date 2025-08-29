
'use client';

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
import { useRide, type RideDetails } from '@/context/RideContext';
import { Badge } from './ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    title: "Ride Mukammal!",
    rideId: "Ride ID",
    rider: "Rider",
    pickup: "Uthanay ki Jagah",
    dropoff: "Manzil",
    fare: "Kiraya",
    tip: "Tip",
    discount: "Discount",
    total: "Kul Raqam",
    paymentMethod: "Cash Payment",
    paymentToastTitle: "Cash Payment",
    paymentToastDesc: "Raqam rider se cash mein leni hai.",
    done: "Done",
  },
  en: {
    title: "Ride Complete!",
    rideId: "Ride ID",
    rider: "Rider",
    pickup: "Pickup Location",
    dropoff: "Dropoff Location",
    fare: "Fare",
    tip: "Tip",
    discount: "Discount",
    total: "Total Amount",
    paymentMethod: "Cash Payment",
    paymentToastTitle: "Cash Payment",
    paymentToastDesc: "Collect cash from the rider.",
    done: "Done",
  },
};

export function RideInvoice({ ride }: { ride: RideDetails }) {
  const { closeInvoice } = useRide();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const tip = 50; // Dummy tip
  const total = ride.fare + tip;

  const handlePaymentMethodClick = () => {
    toast({
      title: t.paymentToastTitle,
      description: t.paymentToastDesc,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && closeInvoice()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className='flex flex-col items-center text-center'>
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <DialogTitle className="text-2xl">{t.title}</DialogTitle>
            <DialogDescription>
              {t.rideId}: {ride.id}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t.rider}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{ride.rider?.name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{ride.rider?.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
             <div className="flex justify-between">
              <span className="text-muted-foreground">{t.pickup}</span>
              <span className="font-medium text-right">{ride.pickup}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">{t.dropoff}</span>
              <span className="font-medium text-right">{ride.dropoff}</span>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.fare}</span>
              <span>PKR {ride.fare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.tip}</span>
              <span>PKR {tip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.discount}</span>
              <span className='text-green-600'>- PKR 0.00</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>{t.total}</span>
            <span>PKR {total.toFixed(2)}</span>
          </div>
           <div className='flex justify-center'>
             <Badge onClick={handlePaymentMethodClick} className="cursor-pointer">{t.paymentMethod}</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={closeInvoice} className="w-full" size="lg">
            {t.done}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
