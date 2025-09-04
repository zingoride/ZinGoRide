
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { Copy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const paymentDetails = {
    easypaisa: '03001234567',
    jazzcash: '03017654321',
};

const translations = {
    ur: {
        title: "Wallet Mein Raqam Shamil Karein",
        description: "Darj-zail numbers par raqam bhaij kar transaction ID yahan darj karein.",
        easypaisa: "Easypaisa Number",
        jazzcash: "Jazzcash Number",
        copy: "Copy",
        copied: "Copied!",
        amount: "Raqam (PKR)",
        transactionId: "Transaction ID",
        submitRequest: "Request Jama Karein",
        submitting: "Requesting...",
        requestSent: "Aapki request bhej di gayi hai.",
        requestSentDesc: "Admin approval ke baad raqam aapke wallet mein shamil kar di jayegi.",
        error: "Ghalti",
        errorDesc: "Request bhejne mein masla hua.",
        amountPlaceholder: "Kitni raqam bheji?",
        trxPlaceholder: "e.g., A1B2C3D4E5",
    },
    en: {
        title: "Add Funds to Wallet",
        description: "Send money to the following numbers and enter the transaction ID below.",
        easypaisa: "Easypaisa Number",
        jazzcash: "Jazzcash Number",
        copy: "Copy",
        copied: "Copied!",
        amount: "Amount (PKR)",
        transactionId: "Transaction ID",
        submitRequest: "Submit Request",
        submitting: "Requesting...",
        requestSent: "Request Sent Successfully",
        requestSentDesc: "Funds will be added to your wallet after admin approval.",
        error: "Error",
        errorDesc: "There was a problem sending your request.",
        amountPlaceholder: "How much did you send?",
        trxPlaceholder: "e.g., A1B2C3D4E5",
    }
}

export function WalletTopUpDialog({ trigger, userType }: { trigger: React.ReactNode, userType?: 'Driver' | 'Customer' }) {
    const { language } = useLanguage();
    const { toast } = useToast();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState('');
    const [loading, setLoading] = useState(false);
    const t = translations[language];

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000); // Reset after 2 seconds
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const amount = Number(formData.get('amount'));
        const transactionId = formData.get('transactionId') as string;

        try {
            await addDoc(collection(db, "walletRequests"), {
                userId: user.uid,
                userName: user.displayName,
                userType: userType || 'Driver', // Default to driver if not specified
                amount: amount,
                transactionId: transactionId,
                status: 'Pending',
                createdAt: serverTimestamp(),
            });

            toast({
                title: t.requestSent,
                description: t.requestSentDesc,
            });
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: t.error,
                description: t.errorDesc,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className='space-y-3'>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                           <div className='flex flex-col'>
                             <span className="text-sm font-medium text-muted-foreground">{t.easypaisa}</span>
                             <span className="font-semibold">{paymentDetails.easypaisa}</span>
                           </div>
                           <Button variant="ghost" size="sm" onClick={() => handleCopy(paymentDetails.easypaisa, 'easypaisa')}>
                             <Copy className={cn("h-4 w-4", copied === 'easypaisa' && "text-green-600")} />
                             <span className="ml-2">{copied === 'easypaisa' ? t.copied : t.copy}</span>
                           </Button>
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-3">
                           <div className='flex flex-col'>
                             <span className="text-sm font-medium text-muted-foreground">{t.jazzcash}</span>
                             <span className="font-semibold">{paymentDetails.jazzcash}</span>
                           </div>
                           <Button variant="ghost" size="sm" onClick={() => handleCopy(paymentDetails.jazzcash, 'jazzcash')}>
                             <Copy className={cn("h-4 w-4", copied === 'jazzcash' && "text-green-600")} />
                              <span className="ml-2">{copied === 'jazzcash' ? t.copied : t.copy}</span>
                           </Button>
                        </div>
                    </div>

                    <Separator />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">{t.amount}</Label>
                            <Input id="amount" name="amount" type="number" placeholder={t.amountPlaceholder} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">{t.transactionId}</Label>
                            <Input id="transactionId" name="transactionId" type="text" placeholder={t.trxPlaceholder} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? t.submitting : t.submitRequest}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
