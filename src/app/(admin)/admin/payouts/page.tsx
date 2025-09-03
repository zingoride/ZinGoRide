
'use client';

import { useState } from "react";
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
import { DollarSign, Send, Banknote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const initialPayouts: PayoutRequest[] = [
  {
    id: 'PO-001',
    amount: 15000,
    method: 'Easypaisa',
    accountNumber: '03001234567',
    status: 'Completed',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: 'PO-002',
    amount: 25000,
    method: 'Jazzcash',
    accountNumber: '03017654321',
    status: 'Completed',
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
];

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
    requestSuccess: "Payout request kamyabi se process ho gayi hai!",
    requestError: "Request bhejne mein masla hua.",
    insufficientFunds: "Aapke paas na-kafi commission balance hai.",
    payoutSuccessDesc: (amount: number, method: string) => `PKR ${amount} aapke ${method} account mein transfer kar diye gaye hain.`,
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
    requestSuccess: "Payout request processed successfully!",
    requestError: "Error sending request.",
    insufficientFunds: "You have insufficient commission balance.",
     payoutSuccessDesc: (amount: number, method: string) => `PKR ${amount} has been transferred to your ${method} account.`,
  }
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(initialPayouts);
  const [totalCommission, setTotalCommission] = useState(187500);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | ''>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const payoutAmount = parseFloat(amount);

    if (payoutAmount > totalCommission) {
        toast({
            variant: "destructive",
            title: t.requestError,
            description: t.insufficientFunds,
        });
        return;
    }
    
    const newPayout: PayoutRequest = {
        id: `PO-${String(payouts.length + 1).padStart(3, '0')}`,
        amount: payoutAmount,
        method: payoutMethod as PayoutMethod,
        accountNumber,
        status: 'Completed', // Simulating instant completion
        date: new Date(),
    };

    setTotalCommission(prev => prev - payoutAmount);
    setPayouts(prev => [newPayout, ...prev]);

    toast({
        title: t.requestSuccess,
        description: t.payoutSuccessDesc(payoutAmount, newPayout.method),
    });

    // Reset form
    setPayoutMethod('');
    setAccountNumber('');
    setAmount('');
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
          <p className="text-4xl font-bold">PKR {totalCommission.toFixed(2)}</p>
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
              <Button type="submit" className="w-full" disabled={!payoutMethod || !accountNumber || !amount}>
                <Send className="mr-2 h-4 w-4" />
                {t.submitRequest}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t.payoutHistory}</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <TableCell className="font-medium">{payout.id}</TableCell>
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
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
