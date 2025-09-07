
'use client';

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Send, Banknote, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

type PayoutStatus = 'Pending' | 'Completed' | 'Failed';
type PayoutMethod = 'Easypaisa' | 'Jazzcash' | 'Bank Transfer';

interface PayoutRequest {
  id: string;
  amount: number;
  method: PayoutMethod;
  accountNumber: string;
  status: PayoutStatus;
  date: Date;
}

const statusConfig = {
  Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800', label: 'Pending', labelUr: 'Pending' },
  Completed: { variant: 'default', className: 'bg-green-100 text-green-800', label: 'Completed', labelUr: 'Mukammal' },
  Failed: { variant: 'destructive', className: 'bg-red-100 text-red-800', label: 'Failed', labelUr: 'Nakam' },
};

const translations = {
  ur: {
    title: "Payouts",
    description: "Apni commission ki kamai manage aur withdraw karein.",
    totalCommission: "Kul Commission Jama Shuda",
    requestPayout: "Payout Request Karein",
    payoutMethod: "Payout Method",
    selectMethod: "Method Chunein",
    accountNumber: "Account Number",
    amount: "Raqam (PKR)",
    submitRequest: "Request Bhejein",
    payoutHistory: "Payout History",
    payoutId: "Payout ID",
    date: "Tareekh",
    status: "Status",
    requestSuccess: "Payout request kamyabi se bhej di gayi hai!",
    requestError: "Request bhejne mein masla hua.",
    insufficientFunds: "Aapke paas na-kafi commission balance hai.",
    payoutSuccessDesc: (amount: number, method: string) => `PKR ${amount} aapke ${method} account mein transfer karne ki request bhej di gayi hai.`,
    loading: "Loading...",
    noHistory: "Abhi tak koi payout history nahi hai.",
  },
  en: {
    title: "Payouts",
    description: "Manage and withdraw your commission earnings.",
    totalCommission: "Total Commission Earned",
    requestPayout: "Request a Payout",
    payoutMethod: "Payout Method",
    selectMethod: "Select Method",
    accountNumber: "Account Number",
    amount: "Amount (PKR)",
    submitRequest: "Submit Request",
    payoutHistory: "Payout History",
    payoutId: "Payout ID",
    date: "Date",
    status: "Status",
    requestSuccess: "Payout request sent successfully!",
    requestError: "Error sending request.",
    insufficientFunds: "You have insufficient commission balance.",
     payoutSuccessDesc: (amount: number, method: string) => `A request to transfer PKR ${amount} to your ${method} account has been sent.`,
     loading: "Loading...",
     noHistory: "No payout history yet.",
  }
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [loadingCommission, setLoadingCommission] = useState(true);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | ''>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);


  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  useEffect(() => {
    const fetchCommission = async () => {
      setLoadingCommission(true);
      const ridesRef = collection(db, "rides");
      const q = query(ridesRef, where("status", "==", "completed"));
      const querySnapshot = await getDocs(q);
      let totalFare = 0;
      querySnapshot.forEach(doc => {
        totalFare += doc.data().fare || 0;
      });
      const calculatedCommission = totalFare * 0.15; // 15% commission
      setTotalCommission(calculatedCommission);
      setLoadingCommission(false);
    };

    const fetchPayouts = async () => {
        const payoutRef = collection(db, "payoutRequests");
        const q = query(payoutRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const payoutList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate()
        } as PayoutRequest));
        setPayouts(payoutList);
    }

    fetchCommission();
    fetchPayouts();
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const payoutAmount = parseFloat(amount);
    
    if (!payoutMethod || !accountNumber || !amount) {
        toast({ variant: "destructive", title: "Missing fields" });
        return;
    }

    if (payoutAmount > totalCommission) {
        toast({
            variant: "destructive",
            title: t.requestError,
            description: t.insufficientFunds,
        });
        return;
    }
    setLoading(true);
    
    try {
        const newPayoutRequest = {
            amount: payoutAmount,
            method: payoutMethod,
            accountNumber,
            status: 'Pending' as PayoutStatus,
            date: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "payoutRequests"), newPayoutRequest);

        // Optimistically update UI
        setPayouts(prev => [{ id: docRef.id, ...newPayoutRequest, date: new Date() }, ...prev]);
        setTotalCommission(prev => prev - payoutAmount);

        toast({
            title: t.requestSuccess,
            description: t.payoutSuccessDesc(payoutAmount, payoutMethod as PayoutMethod),
        });

        // Reset form
        setPayoutMethod('');
        setAccountNumber('');
        setAmount('');

    } catch (error) {
        console.error("Error creating payout request: ", error);
        toast({
            variant: "destructive",
            title: t.requestError
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            {t.totalCommission}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCommission ? (
             <div className="flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="text-2xl font-bold text-muted-foreground">{t.loading}</span>
            </div>
          ) : (
             <p className="text-4xl font-bold">PKR {totalCommission.toFixed(2)}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.requestPayout}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestPayout} className="space-y-4">
               <div className="grid gap-2">
                <Label htmlFor="payout-method">{t.payoutMethod}</Label>
                <Select value={payoutMethod} onValueChange={(value) => setPayoutMethod(value as PayoutMethod)}>
                    <SelectTrigger id="payout-method">
                        <SelectValue placeholder={t.selectMethod} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Easypaisa">Easypaisa</SelectItem>
                        <SelectItem value="Jazzcash">Jazzcash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-number">{t.accountNumber}</Label>
                <Input id="account-number" placeholder="e.g., 03001234567" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">{t.amount}</Label>
                <Input id="amount" type="number" placeholder="e.g., 5000" required value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={!payoutMethod || !accountNumber || !amount || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t.loading : t.submitRequest}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t.payoutHistory}</CardTitle>
            </CardHeader>
            <CardContent>
                 {payouts.length > 0 ? (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t.payoutId}</TableHead>
                        <TableHead>{t.date}</TableHead>
                        <TableHead>{t.status}</TableHead>
                        <TableHead className="text-right">{t.amount}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payouts.map((payout) => {
                        const config = statusConfig[payout.status];
                        return (
                        <TableRow key={payout.id}>
                            <TableCell className="font-medium">{payout.id.substring(0, 8)}</TableCell>
                            <TableCell>{format(payout.date, 'PPp')}</TableCell>
                            <TableCell>
                            <Badge variant={config.variant as any} className={config.className}>
                                {language === 'ur' ? config.labelUr : config.label}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right">PKR {payout.amount.toFixed(2)}</TableCell>
                        </TableRow>
                        )})}
                    </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8">{t.noHistory}</div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
