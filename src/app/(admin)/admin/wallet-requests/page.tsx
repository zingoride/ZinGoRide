
'use client';

import * as React from 'react';
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, writeBatch, getDoc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { manualTopUp } from "@/app/actions";


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
    fundsAdded: (amount: number, name: string) => `${amount} PKR ${name} ke wallet mein shamil kar diye gaye hain.`,
    confirmApproval: "Approval ki Tasdeeq Karein",
    confirmApprovalDesc: (amount: number, name: string) => `Kya aap waqai ${name} ki ${amount} PKR ki request manzoor karna chahte hain? Aap raqam neeche tabdeel kar sakte hain.`,
    finalAmount: "Antim Raqam",
    confirm: "Tasdeeq",
    cancel: "Cancel",
    manualTopUp: "Manual Wallet Top-Up",
    manualTopUpDesc: "Kisi bhi user ke wallet mein barah-e-raast raqam jama karein.",
    userId: "User ID",
    userIdPlaceholder: "User ki ID yahan likhein",
    topUpAmount: "Top-Up Raqam (PKR)",
    topUpAmountPlaceholder: "e.g., 500",
    topUpBtn: "Top-Up Karein",
    topUpSuccess: "Raqam kamyabi se shamil kar di gayi!",
    topUpError: "Raqam shamil karne mein masla hua.",
    topUpLoading: "Shamil kiya ja raha hai...",
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
    fundsAdded: (amount: number, name: string) => `PKR ${amount} has been added to ${name}'s wallet.`,
    confirmApproval: "Confirm Approval",
    confirmApprovalDesc: (amount: number, name: string) => `Are you sure you want to approve the request of PKR ${amount} from ${name}? You can edit the amount below.`,
    finalAmount: "Final Amount",
    confirm: "Confirm",
    cancel: "Cancel",
    manualTopUp: "Manual Wallet Top-Up",
    manualTopUpDesc: "Directly add funds to any user's wallet.",
    userId: "User ID",
    userIdPlaceholder: "Enter User ID",
    topUpAmount: "Top-Up Amount (PKR)",
    topUpAmountPlaceholder: "e.g., 500",
    topUpBtn: "Top-Up",
    topUpSuccess: "Funds added successfully!",
    topUpError: "Failed to add funds.",
    topUpLoading: "Topping up...",
  }
};

function ManualTopUpCard() {
    const { user: adminUser } = useAuth();
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = translations[language];
    const [loading, setLoading] = useState(false);
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleManualTopUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!adminUser) return;
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('adminId', adminUser.uid);
        formData.append('adminName', adminUser.displayName || 'Admin');
        
        const result = await manualTopUp(formData);

        if (result.success) {
            toast({ title: t.topUpSuccess });
            formRef.current?.reset();
        } else {
            toast({
                variant: 'destructive',
                title: t.topUpError,
                description: result.error,
            });
        }
        setLoading(false);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.manualTopUp}</CardTitle>
                <CardDescription>{t.manualTopUpDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleManualTopUp} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId">{t.userId}</Label>
                        <Input id="userId" name="userId" placeholder={t.userIdPlaceholder} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">{t.topUpAmount}</Label>
                        <Input id="amount" name="amount" type="number" placeholder={t.topUpAmountPlaceholder} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.topUpLoading}
                            </>
                        ) : (
                             <>
                                <Send className="mr-2 h-4 w-4" />
                                {t.topUpBtn}
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function WalletRequestsPage() {
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<TopUpRequest | null>(null);
  const [approvalAmount, setApprovalAmount] = useState<number>(0);
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

  const handleOpenApprovalDialog = (request: TopUpRequest) => {
    setSelectedRequest(request);
    setApprovalAmount(request.amount);
  };
  
  const handleConfirmApproval = async () => {
    if (!selectedRequest) return;
    
    setProcessingId(selectedRequest.id);
    const batch = writeBatch(db);
    const requestRef = doc(db, "walletRequests", selectedRequest.id);
    batch.update(requestRef, { status: 'Approved', approvedAmount: approvalAmount });

    const userRef = doc(db, "users", selectedRequest.userId);
    
    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) throw new Error("User not found");

        const currentBalance = userDoc.data().walletBalance || 0;
        batch.update(userRef, { walletBalance: currentBalance + approvalAmount });

        await batch.commit();
        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'Approved' } : r));
        toast({
            title: "Success",
            description: t.fundsAdded(approvalAmount, selectedRequest.userName),
        })
    } catch (error: any) {
        console.error("Error approving request: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to approve the request."
        })
    } finally {
        setProcessingId(null);
        setSelectedRequest(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    const requestRef = doc(db, "walletRequests", requestId);
    try {
        await updateDoc(requestRef, { status: 'Rejected' });
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
        toast({
            title: "Success",
            description: t.requestRejected,
        });
    } catch(error) {
        console.error("Error rejecting request: ", error);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to reject the request."
        })
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground py-16">Loading requests...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="col-span-1 md:col-span-2">
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
                        const isProcessing = processingId === request.id;
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
                                {isProcessing ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleOpenApprovalDialog(request)}>
                                            <CheckCircle className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleReject(request.id)}>
                                            <XCircle className="h-5 w-5" />
                                        </Button>
                                    </>
                                )}
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

        <div className="md:col-start-2">
           <ManualTopUpCard />
        </div>

        {selectedRequest && (
        <AlertDialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t.confirmApproval}</AlertDialogTitle>
                <AlertDialogDescription>
                {t.confirmApprovalDesc(selectedRequest.amount, selectedRequest.userName)}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
                <Label htmlFor="approval-amount">{t.finalAmount}</Label>
                <Input
                id="approval-amount"
                type="number"
                value={approvalAmount}
                onChange={(e) => setApprovalAmount(Number(e.target.value))}
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmApproval}>{t.confirm}</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        )}
    </div>
  )
}
