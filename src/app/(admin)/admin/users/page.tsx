
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
import { MoreHorizontal, FileText, CheckCircle, XCircle, Ban } from "lucide-react";
import { DocumentViewer } from "@/components/document-viewer";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";


type UserStatus = 'Active' | 'Inactive';
type UserType = 'Customer' | 'Driver';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Blocked';

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
  documents?: Document[];
  vehicle?: Vehicle;
}

const approvalStatusConfig = {
  Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  Approved: { variant: 'default', className: 'bg-green-100 text-green-800', label: 'Approved' },
  Rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800', label: 'Rejected' },
  Blocked: { variant: 'destructive', className: 'bg-red-200 text-red-900', label: 'Blocked' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
      const q = query(collection(db, "users"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const usersData: User[] = [];
          querySnapshot.forEach((doc) => {
              usersData.push({ id: doc.id, ...doc.data() } as User);
          });
          setUsers(usersData);
          setLoading(false);
      });

      return () => unsubscribe();
  }, []);


  const handleStatusChange = async (userId: string, newStatus: ApprovalStatus) => {
    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, { approvalStatus: newStatus });
        toast({
            title: "Status Updated",
            description: `User status changed to ${newStatus}`,
        });
        if (selectedUser?.id === userId) {
            setSelectedUser(prev => prev ? { ...prev, approvalStatus: newStatus } : null);
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update user status.",
        });
    }
  };
  
  const handleViewDocuments = (user: User) => {
    if (user.type === 'Driver') {
      setSelectedUser(user);
    }
  };

  if (loading) {
      return <div className="text-center text-muted-foreground py-16">Loading users...</div>
  }

  return (
    <>
      {selectedUser && (
        <DocumentViewer 
          user={selectedUser} 
          isOpen={!!selectedUser} 
          onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}
          onApprovalChange={handleStatusChange}
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
                    <TableHead>Approval Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => {
                    const approvalConfig = approvalStatusConfig[user.approvalStatus] || approvalStatusConfig.Pending;
                    return (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id.substring(0, 8)}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.type === 'Driver' ? 'secondary' : 'outline'}>
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
                    <TableCell className="text-right">
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
