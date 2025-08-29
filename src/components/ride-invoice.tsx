
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

export function RideInvoice({ ride }: { ride: RideDetails }) {
  const { closeInvoice } = useRide();
  const { toast } = useToast();
  const tip = 50; // Dummy tip
  const total = ride.fare + tip;

  const handlePaymentMethodClick = () => {
    toast({
      title: 'Cash Payment',
      description: 'Raqam rider se cash mein leni hai.',
    });
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && closeInvoice()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className='flex flex-col items-center text-center'>
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <DialogTitle className="text-2xl">Ride Mukammal!</DialogTitle>
            <DialogDescription>
              Ride ID: {ride.id}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Rider</span>
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
              <span className="text-muted-foreground">Uthanay ki Jagah</span>
              <span className="font-medium text-right">{ride.pickup}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Manzil</span>
              <span className="font-medium text-right">{ride.dropoff}</span>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kiraya</span>
              <span>PKR {ride.fare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tip</span>
              <span>PKR {tip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className='text-green-600'>- PKR 0.00</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Kul Raqam</span>
            <span>PKR {total.toFixed(2)}</span>
          </div>
           <div className='flex justify-center'>
             <Badge onClick={handlePaymentMethodClick} className="cursor-pointer">Cash Payment</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={closeInvoice} className="w-full" size="lg">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
