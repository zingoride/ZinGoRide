
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
type PayoutMethod = 'Easypaisa' | 'Jazzcash';

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
  {
    id: 'PO-003',
    amount: 10000,
    method: 'Easypaisa',
    accountNumber: '03001234567',
    status: 'Failed',
    date: new Date(new Date().setDate(new Date().getDate() - 7)),
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
    requestSuccess: "Payout request kamyabi se bhej di gayi hai!",
    requestError: "Request bhejne mein masla hua.",
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
  }
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(initialPayouts);
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: t.requestSuccess,
    });
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
          <p className="text-4xl font-bold">PKR 187,500</p>
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
                <Select>
                    <SelectTrigger id="payout-method">
                        <SelectValue placeholder={t.selectMethod} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easypaisa">Easypaisa</SelectItem>
                        <SelectItem value="jazzcash">Jazzcash</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-number">{t.accountNumber}</Label>
                <Input id="account-number" placeholder="e.g., 03001234567" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">{t.amount}</Label>
                <Input id="amount" type="number" placeholder="e.g., 5000" required />
              </div>
              <Button type="submit" className="w-full">
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
                        <TableCell>{format(payout.date, 'PP')}</TableCell>
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
