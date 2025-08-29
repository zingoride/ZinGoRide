
'use client';
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

const users = [
  { id: 'USR-001', name: 'Ahmad Ali', email: 'ahmad.ali@example.com', type: 'Customer', status: 'Active' },
  { id: 'USR-002', name: 'Ali Khan', email: 'ali.khan@example.com', type: 'Driver', status: 'Active' },
  { id: 'USR-003', name: 'Fatima Ahmed', email: 'fatima.ahmed@example.com', type: 'Customer', status: 'Inactive' },
  { id: 'USR-004', name: 'Zain Malik', email: 'zain.malik@example.com', type: 'Driver', status: 'Active' },
  { id: 'USR-005', name: 'Sana Javed', email: 'sana.javed@example.com', type: 'Customer', status: 'Active' },
]

export default function UsersPage() {
  return (
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
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
                  <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-green-500' : ''}>
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
