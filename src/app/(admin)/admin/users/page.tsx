
'use client';
import { useState, useEffect, useCallback } from "react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, CheckCircle, XCircle, Ban, MessageSquare, Bell, BellOff, Edit, Loader2, User, ShieldCheck, Shield } from "lucide-react";
import { DocumentViewer } from "@/components/document-viewer";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, query, orderBy, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ChatDialog } from "@/components/chat-dialog";
import { usePinVerification } from "@/context/PinVerificationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type UserStatus = 'Active' | 'Inactive';
type UserType = 'Customer' | 'Driver' | 'Admin';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
type NotificationStatus = 'granted' | 'denied' | 'default';

interface Document {
  name: string;
  url: string;
}

interface Vehicle {
  make: string;
  model: string;
  licensePlate: string;
  type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  status: UserStatus;
  approvalStatus: ApprovalStatus;
  notificationStatus?: NotificationStatus;
  documents?: Document[];
  vehicle?: Vehicle;
}

const approvalStatusConfig = {
  Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200', label: 'Pending' },
  Approved: { variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200', label: 'Approved' },
  Rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200', label: 'Rejected' },
  Blocked: { variant: 'destructive', className: 'bg-zinc-700 text-zinc-100', label: 'Blocked' },
};

const notificationStatusConfig = {
    granted: { label: 'Allowed', icon: Bell, className: 'text-green-600' },
    denied: { label: 'Denied', icon: BellOff, className: 'text-red-600' },
    default: { label: 'Unknown', icon: BellOff, className: 'text-muted-foreground' }
}

function EditUserDialog({ user, isOpen, onOpenChange, onUserUpdate }: { user: User | null, isOpen: boolean, onOpenChange: (open: boolean) => void, onUserUpdate: (updatedData: Partial<User>) => void }) {
    const [name, setName] = useState('');
    const [userType, setUserType] = useState<UserType>('Customer');
    const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('Pending');
    const [loading, setLoading] = useState(false);
    const { requestPinVerification, isPinSet, isSessionActive } = usePinVerification();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setUserType(user.type);
            setApprovalStatus(user.approvalStatus);
        }
    }, [user]);
    
    if (!user) return null;
    
    const performUpdate = async () => {
        setLoading(true);
        const userDocRef = doc(db, "users", user.id);
        const updatedData = {
            name,
            type: userType,
            approvalStatus,
        };
        try {
            await setDoc(userDocRef, updatedData, { merge: true });
            onUserUpdate({ id: user.id, ...updatedData });
            toast({ title: "User Updated", description: `${name}'s profile has been updated.` });
            onOpenChange(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update user.' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSave = () => {
        if (!isPinSet() || isSessionActive()) {
            performUpdate();
        } else {
            requestPinVerification(performUpdate);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User: {user.name}</DialogTitle>
                    <DialogDescription>Update user details below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">User Type</Label>
                        <RadioGroup value={userType} onValueChange={(v) => setUserType(v as UserType)} className="col-span-3 flex gap-4">
                            <Label htmlFor="customer-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Customer" id="customer-radio" /> Customer</Label>
                            <Label htmlFor="driver-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Driver" id="driver-radio" /> Driver</Label>
                            <Label htmlFor="admin-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Admin" id="admin-radio" /> Admin</Label>
                        </RadioGroup>
                    </div>
                     {userType === 'Driver' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Approval</Label>
                            <RadioGroup value={approvalStatus} onValueChange={(v) => setApprovalStatus(v as ApprovalStatus)} className="col-span-3 flex gap-2">
                                <Label htmlFor="approved-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Approved" id="approved-radio" /> Approved</Label>
                                <Label htmlFor="pending-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Pending" id="pending-radio" /> Pending</Label>
                                <Label htmlFor="rejected-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Rejected" id="rejected-radio" /> Rejected</Label>
                                <Label htmlFor="blocked-radio" className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Blocked" id="blocked-radio" /> Blocked</Label>
                            </RadioGroup>
                        </div>
                     )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserForDocs, setSelectedUserForDocs] = useState<User | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user: adminUser } = useAuth();
  const { requestPinVerification, isPinSet, isSessionActive } = usePinVerification();

  useEffect(() => {
    setLoading(true);
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() // Convert Timestamp to Date
        } as User));
        setUsers(usersList);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching users: ", error);
        toast({ variant: "destructive", title: "Error fetching users", description: "Could not retrieve user data." });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const handleUserUpdate = (updatedData: Partial<User>) => {
      setUsers(prevUsers => prevUsers.map(user => user.id === updatedData.id ? { ...user, ...updatedData } : user));
  }
  
  const performStatusChange = async (userId: string, newStatus: ApprovalStatus) => {
    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { approvalStatus: newStatus });
        handleUserUpdate({ id: userId, approvalStatus: newStatus });
        toast({ title: "Status Updated", description: `User status changed to ${newStatus}` });
    } catch (error) {
        console.error("Error updating status: ", error);
        toast({ variant: "destructive", title: "Error updating status" });
    }
  };

  const handleStatusChange = (userId: string, newStatus: ApprovalStatus) => {
      if (!isPinSet() || isSessionActive()) {
          performStatusChange(userId, newStatus);
      } else {
          requestPinVerification(() => performStatusChange(userId, newStatus));
      }
  };

  const handleViewDocuments = (user: User) => {
    if (user.type === 'Driver' && user.documents) {
      setSelectedUserForDocs(user);
    }
  };

  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  }

  if (loading) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <>
      {selectedUserForDocs && (
        <DocumentViewer 
          user={selectedUserForDocs} 
          isOpen={!!selectedUserForDocs} 
          onOpenChange={(isOpen) => !isOpen && setSelectedUserForDocs(null)}
        />
      )}
      <EditUserDialog 
        user={selectedUserForEdit}
        isOpen={!!selectedUserForEdit}
        onOpenChange={(isOpen) => !isOpen && setSelectedUserForEdit(null)}
        onUserUpdate={handleUserUpdate}
      />
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
           {users.length > 0 ? (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Notifications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => {
                    const approvalConfig = approvalStatusConfig[user.approvalStatus] || approvalStatusConfig.Pending;
                    const notifConfig = notificationStatusConfig[user.notificationStatus || 'default'];
                    const NotifIcon = notifConfig.icon;
                    const chatId = adminUser ? getChatId(adminUser.uid, user.id) : null;
                    return (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id.substring(0, 8)}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.type === 'Driver' ? 'secondary' : user.type === 'Admin' ? 'default' : 'outline'}>
                        {user.type}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        {user.type === 'Driver' && (
                        <Badge variant={approvalConfig.variant as any} className={approvalConfig.className}>
                            {approvalConfig.label}
                        </Badge>
                        )}
                    </TableCell>
                    <TableCell>
                       {user.type !== 'Admin' && (
                        <div className="flex items-center gap-2">
                           <NotifIcon className={`h-4 w-4 ${notifConfig.className}`} />
                           <span className={notifConfig.className}>{notifConfig.label}</span>
                        </div>
                       )}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                        {chatId && user.type !== 'Admin' && (
                           <ChatDialog 
                                chatId={chatId}
                                chatPartnerId={user.id}
                                chatPartnerName={user.name}
                                trigger={<Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>}
                            />
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedUserForEdit(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit User</span>
                                </DropdownMenuItem>
                            {user.type === 'Driver' && (
                                <>
                                {user.documents && user.documents.length > 0 && (
                                    <DropdownMenuItem onClick={() => handleViewDocuments(user)}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>View Documents</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {user.approvalStatus !== 'Approved' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Approved')}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        <span>Approve</span>
                                    </DropdownMenuItem>
                                )}
                                {user.approvalStatus !== 'Rejected' && (
                                     <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Rejected')}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        <span>Reject</span>
                                    </DropdownMenuItem>
                                )}
                                {user.approvalStatus !== 'Blocked' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Blocked')}>
                                        <Ban className="mr-2 h-4 w-4" />
                                        <span>Block</span>
                                    </DropdownMenuItem>
                                )}
                                </>
                            )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )})}
                </TableBody>
            </Table>
            ) : (
                <div className="text-center text-muted-foreground py-16">No users found.</div>
            )}
        </CardContent>
      </Card>
    </>
  )
}
