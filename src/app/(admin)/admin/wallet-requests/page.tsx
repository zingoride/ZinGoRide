
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, writeBatch, getDoc } from "firebase/firestore";
import {FieldValue} from "firebase/firestore";


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
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  useEffect(() => {
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const requestsCollection = collection(db, "walletRequests");
            const q = query(requestsCollection, orderBy("createdAt", "desc"));
            const requestSnapshot = await getDocs(q);
            const requestList = requestSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: (doc.data().createdAt as any).toDate(),
            } as TopUpRequest));
            setRequests(requestList);
        } catch (error) {
            console.error("Error fetching wallet requests: ", error);
            toast({
                variant: "destructive",
                title: "Error fetching requests",
                description: "Could not retrieve wallet requests from Firestore. Please ensure the collection exists and you have created the necessary indexes in Firestore.",
            });
        }
        setLoading(false);
    }
    fetchRequests();
  }, [toast]);

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    const request = requests.find(req => req.id === requestId);
    if (!request) return;
    
    const batch = writeBatch(db);
    const requestRef = doc(db, "walletRequests", requestId);
    batch.update(requestRef, { status: newStatus });

    if (newStatus === 'Approved') {
        const userRef = doc(db, "users", request.userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
             const currentBalance = userDoc.data().walletBalance || 0;
             batch.update(userRef, { walletBalance: currentBalance + request.amount });
        }
    }

    try {
        await batch.commit();
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
        
        if (newStatus === 'Approved') {
            toast({
                title: "Success",
                description: t.fundsAdded(request.amount, request.userName),
            })
        } else { // Rejected
            toast({
                title: "Success",
                description: t.requestRejected,
            })
        }
    } catch (error) {
        console.error("Error updating request: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update the request status."
        })
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground py-16">Loading requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
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
                  <TableCell className="font-medium">{request.id.substring(0,8)}</TableCell>
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
        ) : (
          <div className="text-center text-muted-foreground py-16">No pending wallet requests.</div>
        )}
      </CardContent>
    </Card>
  )
}
