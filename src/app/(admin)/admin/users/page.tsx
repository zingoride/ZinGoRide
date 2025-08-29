
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, CheckCircle, XCircle } from "lucide-react";
import { DocumentViewer } from "@/components/document-viewer";

type UserStatus = 'Active' | 'Inactive';
type UserType = 'Customer' | 'Driver';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface Document {
  name: string;
  url: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  status: UserStatus;
  approvalStatus: ApprovalStatus;
  documents: Document[];
}

const initialUsers: User[] = [
  { 
    id: 'USR-001', 
    name: 'Ahmad Ali', 
    email: 'ahmad.ali@example.com', 
    type: 'Customer', 
    status: 'Active',
    approvalStatus: 'Approved',
    documents: []
  },
  { 
    id: 'USR-002', 
    name: 'Ali Khan', 
    email: 'ali.khan@example.com', 
    type: 'Driver', 
    status: 'Active',
    approvalStatus: 'Pending',
    documents: [
      { name: 'CNIC Front', url: 'https://picsum.photos/seed/cnic1/400/250' },
      { name: 'CNIC Back', url: 'https://picsum.photos/seed/cnic2/400/250' },
      { name: 'Driving License', url: 'https://picsum.photos/seed/license/400/250' }
    ] 
  },
  { 
    id: 'USR-003', 
    name: 'Fatima Ahmed', 
    email: 'fatima.ahmed@example.com', 
    type: 'Customer', 
    status: 'Inactive',
    approvalStatus: 'Approved',
    documents: []
  },
  { 
    id: 'USR-004', 
    name: 'Zain Malik', 
    email: 'zain.malik@example.com', 
    type: 'Driver', 
    status: 'Active',
    approvalStatus: 'Approved',
    documents: [
      { name: 'CNIC Front', url: 'https://picsum.photos/seed/cnic3/400/250' },
      { name: 'CNIC Back', url: 'https://picsum.photos/seed/cnic4/400/250' },
      { name: 'Driving License', url: 'https://picsum.photos/seed/license2/400/250' }
    ] 
  },
  { 
    id: 'USR-005', 
    name: 'Sana Javed', 
    email: 'sana.javed@example.com', 
    type: 'Customer', 
    status: 'Active',
    approvalStatus: 'Approved',
    documents: []
  },
   { 
    id: 'USR-006', 
    name: 'Bilal Hassan', 
    email: 'bilal.hassan@example.com', 
    type: 'Driver', 
    status: 'Inactive',
    approvalStatus: 'Rejected',
    documents: [
      { name: 'CNIC Front', url: 'https://picsum.photos/seed/cnic5/400/250' },
      { name: 'CNIC Back', url: 'https://picsum.photos/seed/cnic6/400/250' },
      { name: 'Driving License', url: 'https://picsum.photos/seed/license3/400/250' }
    ] 
  },
];

const approvalStatusConfig = {
  Pending: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  Approved: { variant: 'default', className: 'bg-green-100 text-green-800', label: 'Approved' },
  Rejected: { variant: 'destructive', className: 'bg-red-100 text-red-800', label: 'Rejected' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleApprovalChange = (userId: string, newStatus: ApprovalStatus) => {
    setUsers(users.map(user => user.id === userId ? { ...user, approvalStatus: newStatus } : user));
  };
  
  const handleViewDocuments = (user: User) => {
    if (user.type === 'Driver') {
      setSelectedUser(user);
    }
  };

  return (
    <>
      {selectedUser && (
        <DocumentViewer 
          user={selectedUser} 
          isOpen={!!selectedUser} 
          onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}
          onApprovalChange={handleApprovalChange}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
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
                const approvalConfig = approvalStatusConfig[user.approvalStatus];
                return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.type === 'Driver' ? 'secondary' : 'outline'}>
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={approvalConfig.variant as any} className={approvalConfig.className}>
                      {approvalConfig.label}
                    </Badge>
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
                           <DropdownMenuItem onClick={() => handleViewDocuments(user)}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Documents</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleApprovalChange(user.id, 'Approved')}>
                             <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Approve</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleApprovalChange(user.id, 'Rejected')}>
                             <XCircle className="mr-2 h-4 w-4" />
                            <span>Reject</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
