
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, GeoPoint } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import L from 'leaflet';

// Define the User type, including the location property
export interface User {
  id: string;
  name: string;
  type: 'Driver' | 'Customer';
  status: 'Active' | 'Inactive';
  // Assuming location is stored as a Firestore GeoPoint or a similar object
  location?: GeoPoint | { latitude: number; longitude: number }; 
  [key: string]: any;
}


// Define custom icons directly in the file that uses them
export const carIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png',
  iconRetinaUrl: 'https://img.icons8.com/ios-filled/100/000000/car.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export const customerIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/user-male-circle.png',
  iconRetinaUrl: 'https://img.icons8.com/ios-filled/100/000000/user-male-circle.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Dynamically import the map component to ensure it's client-side only
const DynamicMap = dynamic(() => import('@/components/dynamic-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
});


export default function LiveMapPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Query to get all active users
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("status", "==", "Active"));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as User))
        .filter(user => user.location); // Only include users that have a location

      setUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const filteredUsers = useMemo(() => {
    if (filter === 'all') return users;
    // The filter values are 'driver' and 'customer' (lowercase)
    return users.filter(user => user.type.toLowerCase() === filter);
  }, [users, filter]);

  const mapMarkers = useMemo(() => {
    return filteredUsers.map(user => {
      const loc = user.location;
      // Handle both GeoPoint and object-based location formats
      const position: [number, number] = loc
        ? ('latitude' in loc ? [loc.latitude, loc.longitude] : [24.86, 67.01]) // Default to Karachi if format is wrong
        : [24.86, 67.01]; // Default position if no location

      return {
        position: position,
        popupText: `${user.name} - ${user.type}`,
        icon: user.type === 'Driver' ? carIcon : customerIcon,
      };
    });
  }, [filteredUsers]);

  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Live Map</CardTitle>
            <CardDescription>View live locations of all active users.</CardDescription>
          </div>
          <div className="w-[180px]">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="driver">Drivers Only</SelectItem>
                <SelectItem value="customer">Customers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex-1">
        <CardContent className="p-0 h-full">
            {loading ? (
                 <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
            ) : (
                 <DynamicMap markers={mapMarkers} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
