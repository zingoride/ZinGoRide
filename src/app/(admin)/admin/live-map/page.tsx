
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Car, Users, Circle } from 'lucide-react';
import type { User as UserType } from '../users/page';
import { db } from "@/lib/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';

const LiveMapPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const usersCollection = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserType));
        setUsers(usersList);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.type.toLowerCase() === filter;
  });

  const renderUserCards = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4">
                 <Skeleton className="h-12 w-12 rounded-full" />
                 <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
            </CardHeader>
        </Card>
      ));
    }

    if (filteredUsers.length === 0) {
        return <p className="col-span-full text-center text-muted-foreground">No users found for this filter.</p>
    }

    return filteredUsers.map(user => (
      <Card key={user.id} className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} data-ai-hint="portrait" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-base">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
           <Badge variant={user.type === 'Driver' ? 'secondary' : 'outline'}>
                {user.type === 'Driver' ? <Car className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                {user.type}
            </Badge>
        </CardHeader>
        <CardFooter className="text-xs text-muted-foreground justify-between">
            <div>
                 <p>Status: {user.status}</p>
            </div>
            <div className="flex items-center gap-1">
                <Circle className={`h-2 w-2 ${user.status === 'Active' ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
                <span>{user.approvalStatus}</span>
            </div>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
             <CardTitle>Live Fleet Overview</CardTitle>
             <CardDescription>View all active users in a list instead of a map.</CardDescription>
          </div>
          <div className="w-[180px]">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><Users className="mr-2 h-4 w-4" />All Users</SelectItem>
                <SelectItem value="Driver"><Car className="mr-2 h-4 w-4" />Drivers</SelectItem>
                <SelectItem value="Customer"><User className="mr-2 h-4 w-4" />Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderUserCards()}
      </div>
    </div>
  );
};

export default LiveMapPage;
