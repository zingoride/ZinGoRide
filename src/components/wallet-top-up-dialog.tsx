
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckoutForm } from './stripe-checkout-form';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const translations = {
    ur: {
        title: "Wallet Mein Raqam Shamil Karein",
        description: "Credit/Debit card istemal kar ke foran raqam shamil karein.",
        requestSent: "Aapki request bhej di gayi hai.",
        requestSentDesc: "Admin approval ke baad raqam aapke wallet mein shamil kar di jayegi.",
        error: "Ghalti",
        errorDesc: "Request bhejne mein masla hua.",
    },
    en: {
        title: "Add Funds to Wallet",
        description: "Instantly add funds using a credit/debit card.",
        requestSent: "Request Sent Successfully",
        requestSentDesc: "Funds will be added to your wallet after admin approval.",
        error: "Error",
        errorDesc: "There was a problem sending your request.",
    }
}

export function WalletTopUpDialog({ trigger, userType }: { trigger: React.ReactNode, userType?: 'Driver' | 'Customer' }) {
    const { language } = useLanguage();
    const { toast } = useToast();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(500); // Default amount
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const t = translations[language];


    const handlePaymentSuccess = () => {
        setOpen(false);
        toast({
            title: "Payment Successful",
            description: `PKR ${amount} has been added to your wallet.`
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                 <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <StripeCheckoutForm 
                      amount={amount} 
                      onSuccess={handlePaymentSuccess} 
                      setClientSecret={setClientSecret} 
                    />
                </Elements>
            </DialogContent>
        </Dialog>
    );
}
