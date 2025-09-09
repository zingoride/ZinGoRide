
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, CheckCircle, XCircle, Ban, MessageSquare, Bell, BellOff } from "lucide-react";
import { DocumentViewer } from "@/components/document-viewer";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ChatDialog } from "@/components/chat-dialog";

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
  Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  Approved: { variant: 'default', className: 'bg-green-100 text-green-800', label: 'Approved' },
  Rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800', label: 'Rejected' },
  Blocked: { variant: 'destructive', className: 'bg-red-200 text-red-900', label: 'Blocked' },
};

const notificationStatusConfig = {
    granted: { label: 'Allowed', icon: Bell, className: 'text-green-600' },
    denied: { label: 'Denied', icon: BellOff, className: 'text-red-600' },
    default: { label: 'Unknown', icon: BellOff, className: 'text-muted-foreground' }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserForDocs, setSelectedUserForDocs] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user: adminUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
        toast({
          variant: "destructive",
          title: "Error fetching users",
          description: "Could not retrieve user data from Firestore.",
        });
      }
      setLoading(false);
    };

    fetchUsers();
  }, [toast]);


  const handleStatusChange = async (userId: string, newStatus: ApprovalStatus) => {
    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { approvalStatus: newStatus });
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === userId ? { ...user, approvalStatus: newStatus } : user
            )
        );
        toast({
            title: "Status Updated",
            description: `User status changed to ${newStatus}`,
        });
        if (selectedUserForDocs?.id === userId) {
            setSelectedUserForDocs(prev => prev ? { ...prev, approvalStatus: newStatus } : null);
        }
    } catch (error) {
        console.error("Error updating status: ", error);
         toast({
            variant: "destructive",
            title: "Error updating status",
        });
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
      return <div className="text-center text-muted-foreground py-16">Loading users...</div>
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
                        {user.type === 'Driver' && (
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                              {user.documents && user.documents.length > 0 && (
                                  <DropdownMenuItem onClick={() => handleViewDocuments(user)}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      <span>View Documents</span>
                                  </DropdownMenuItem>
                              )}

                              {user.approvalStatus === 'Pending' && (
                                  <>
                                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Approved')}>
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          <span>Approve</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Rejected')}>
                                          <XCircle className="mr-2 h-4 w-4" />
                                          <span>Reject</span>
                                      </DropdownMenuItem>
                                  </>
                              )}

                              {user.approvalStatus === 'Approved' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Blocked')}>
                                      <Ban className="mr-2 h-4 w-4" />
                                      <span>Block</span>
                                  </DropdownMenuItem>
                              )}
                              
                              {(user.approvalStatus === 'Rejected' || user.approvalStatus === 'Blocked') && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Approved')}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      <span>Re-Approve</span>
                                  </DropdownMenuItem>
                              )}
                              
                              </DropdownMenuContent>
                          </DropdownMenu>
                        )}
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
