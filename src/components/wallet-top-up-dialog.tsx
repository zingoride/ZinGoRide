
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


const translations = {
    ur: {
        title: "Wallet Top-Up Request",
        description: "Raqam aur transaction ID darj karein. Admin approval ke baad raqam shamil kar di jayegi.",
        amount: "Raqam (PKR)",
        amountPlaceholder: "e.g., 500",
        transactionId: "Easypaisa/Jazzcash Transaction ID",
        transactionIdPlaceholder: "e.g., 1234567890",
        sendRequest: "Request Bhejein",
        sending: "Bheja ja raha hai...",
        requestSent: "Aapki request bhej di gayi hai.",
        requestSentDesc: "Admin approval ke baad raqam aapke wallet mein shamil kar di jayegi.",
        error: "Ghalti",
        errorDesc: "Request bhejne mein masla hua.",
    },
    en: {
        title: "Wallet Top-Up Request",
        description: "Enter the amount and transaction ID. Funds will be added after admin approval.",
        amount: "Amount (PKR)",
        amountPlaceholder: "e.g., 500",
        transactionId: "Easypaisa/Jazzcash Transaction ID",
        transactionIdPlaceholder: "e.g., 1234567890",
        sendRequest: "Send Request",
        sending: "Sending...",
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
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const t = translations[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !amount || !transactionId) return;

        setLoading(true);

        try {
            const requestsCollection = collection(db, "walletRequests");
            await addDoc(requestsCollection, {
                userId: user.uid,
                userName: user.displayName || "N/A",
                userType: userType || 'Customer',
                amount: parseFloat(amount),
                transactionId: transactionId,
                status: 'Pending',
                createdAt: serverTimestamp(),
            });

            toast({
                title: t.requestSent,
                description: t.requestSentDesc,
            });

            setAmount('');
            setTransactionId('');
            setOpen(false);

        } catch (error) {
            console.error("Error sending top-up request:", error);
            toast({
                variant: 'destructive',
                title: t.error,
                description: t.errorDesc
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="amount">{t.amount}</Label>
                        <Input 
                            id="amount" 
                            type="number"
                            placeholder={t.amountPlaceholder}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="transactionId">{t.transactionId}</Label>
                        <Input 
                            id="transactionId" 
                            placeholder={t.transactionIdPlaceholder}
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? t.sending : t.sendRequest}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
