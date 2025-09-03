
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useWallet } from "@/context/WalletContext";

type RequestStatus = 'Pending' | 'Approved' | 'Rejected';
type UserType = 'Customer' | 'Driver';

interface TopUpRequest {
  id: string;
  userId: string;
  userName: string;
  userType: UserType;
  amount: number;
  transactionId: string;
  status: RequestStatus;
  date: Date;
}

const initialRequests: TopUpRequest[] = [
  { 
    id: 'TR-001', 
    userId: 'USR-002',
    userName: 'Ali Khan',
    userType: 'Driver',
    amount: 1000,
    transactionId: 'A1B2C3D4E5',
    status: 'Pending',
    date: new Date(),
  },
  { 
    id: 'TR-002', 
    userId: 'USR-001',
    userName: 'Ahmad Ali',
    userType: 'Customer',
    amount: 500,
    transactionId: 'F6G7H8I9J0',
    status: 'Pending',
    date: new Date(new Date().setDate(new Date().getDate() -1)),
  },
  { 
    id: 'TR-003', 
    userId: 'USR-004',
    userName: 'Zain Malik',
    userType: 'Driver',
    amount: 2000,
    transactionId: 'K1L2M3N4O5',
    status: 'Approved',
    date: new Date(new Date().setDate(new Date().getDate() -2)),
  },
  { 
    id: 'TR-004', 
    userId: 'USR-003',
    userName: 'Fatima Ahmed',
    userType: 'Customer',
    amount: 300,
    transactionId: 'P6Q7R8S9T0',
    status: 'Rejected',
    date: new Date(new Date().setDate(new Date().getDate() -3)),
  },
];

const statusConfig = {
  Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200', label: 'Pending', labelUr: 'Pending' },
  Approved: { variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200', label: 'Approved', labelUr: 'Manzoor' },
  Rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200', label: 'Rejected', labelUr: 'Mustarad' },
};

const translations = {
  ur: {
    title: "Wallet Requests",
    description: "Customers aur drivers ki taraf se wallet top-up requests manage karein.",
    requestId: "Request ID",
    userName: "User Ka Naam",
    userType: "User Ki Qisam",
    amount: "Raqam (PKR)",
    transactionId: "Transaction ID",
    date: "Tareekh",
    status: "Status",
    actions: "Actions",
    approve: "Manzoor",
    reject: "Mustarad",
    requestApproved: "Request manzoor kar li gayi!",
    requestRejected: "Request mustarad kar di gayi!",
    driver: "Driver",
    customer: "Customer",
    fundsAdded: (amount: number, name: string) => `${amount} PKR ${name} ke wallet mein shamil kar diye gaye hain.`
  },
  en: {
    title: "Wallet Requests",
    description: "Manage wallet top-up requests from customers and drivers.",
    requestId: "Request ID",
    userName: "User Name",
    userType: "User Type",
    amount: "Amount (PKR)",
    transactionId: "Transaction ID",
    date: "Date",
    status: "Status",
    actions: "Actions",
    approve: "Approve",
    reject: "Reject",
    requestApproved: "Request has been approved!",
    requestRejected: "Request has been rejected!",
    driver: "Driver",
    customer: "Customer",
    fundsAdded: (amount: number, name: string) => `PKR ${amount} has been added to ${name}'s wallet.`
  }
};

export default function WalletRequestsPage() {
  const [requests, setRequests] = useState<TopUpRequest[]>(initialRequests);
  const { language } = useLanguage();
  const { toast } = useToast();
  const { addFunds } = useWallet();
  const t = translations[language];

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    const request = requests.find(req => req.id === requestId);
    if (!request) return;

    if (newStatus === 'Approved') {
        addFunds(request.amount);
         toast({
            title: "Success",
            description: t.fundsAdded(request.amount, request.userName),
        })
    } else {
         toast({
            title: "Success",
            description: t.requestRejected,
        })
    }
    
    setRequests(requests.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.requestId}</TableHead>
              <TableHead>{t.userName}</TableHead>
              <TableHead>{t.userType}</TableHead>
              <TableHead>{t.amount}</TableHead>
              <TableHead>{t.transactionId}</TableHead>
              <TableHead>{t.date}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const config = statusConfig[request.status];
              return (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.userName}</TableCell>
                <TableCell>
                   <Badge variant={request.userType === 'Driver' ? 'secondary' : 'outline'}>
                        {request.userType === 'Driver' ? t.driver : t.customer}
                    </Badge>
                </TableCell>
                <TableCell>PKR {request.amount.toFixed(2)}</TableCell>
                <TableCell>{request.transactionId}</TableCell>
                <TableCell>{format(request.date, 'PP')}</TableCell>
                <TableCell>
                  <Badge variant={config.variant as any} className={config.className}>
                    {language === 'ur' ? config.labelUr : config.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === 'Pending' && (
                     <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleStatusChange(request.id, 'Approved')}>
                            <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleStatusChange(request.id, 'Rejected')}>
                            <XCircle className="h-5 w-5" />
                        </Button>
                     </div>
                  )}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

    
