
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
import { useWallet } from '@/context/WalletContext';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';


const translations = {
  ur: {
    title: "Safar Mukammal!",
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
    earningsAdded: "Aapki kamai wallet mein jama kar di gayi hai.",
    commission: "Commission (15%)",
    netEarnings: "Aapki Kamai",
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
    earningsAdded: "Your earnings have been added to your wallet.",
    commission: "Commission (15%)",
    netEarnings: "Your Earnings",
  },
};

export function RideInvoice({ ride }: { ride: RideDetails }) {
  const { closeInvoice } = useRide();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language];

  const tip = 50; // Dummy tip for now
  const commissionRate = 0.15; // 15%
  const fare = ride.fare || 0;
  const commission = fare * commissionRate;
  const netEarnings = fare - commission;
  const totalPayable = fare + tip;

  useEffect(() => {
    // This effect runs once when the invoice is mounted.
    // It updates the driver's wallet balance in Firestore.
    const addEarningsToWallet = async () => {
        if (netEarnings > 0 && user?.uid === ride.driverId) {
            try {
                const driverRef = doc(db, "users", ride.driverId);
                await updateDoc(driverRef, {
                    walletBalance: increment(netEarnings)
                });
                toast({
                    title: t.earningsAdded,
                    description: `PKR ${netEarnings.toFixed(2)} credited.`,
                });
            } catch (error) {
                console.error("Error adding earnings to wallet: ", error);
            }
        }
    }
    
    addEarningsToWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

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
              {t.rideId}: {ride.id.substring(0,8)}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t.rider}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{ride.customerName}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
             <div className="flex justify-between text-right">
              <span className="text-muted-foreground">{t.pickup}</span>
              <span className="font-medium">{ride.pickup}</span>
            </div>
             <div className="flex justify-between text-right">
              <span className="text-muted-foreground">{t.dropoff}</span>
              <span className="font-medium">{ride.dropoff}</span>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.fare}</span>
              <span>PKR {fare.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">{t.commission}</span>
              <span className="text-red-600">- PKR {commission.toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground">{t.netEarnings}</span>
              <span>PKR {netEarnings.toFixed(2)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">{t.tip}</span>
              <span>PKR {tip.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>{t.total} (Payable by Customer)</span>
            <span>PKR {totalPayable.toFixed(2)}</span>
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
