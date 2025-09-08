
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, GeoPoint } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    liveMap: "Live Map",
    description: "Tamam active users ki live location dekhein.",
    filterUsers: "Users Filter Karein",
    allUsers: "Tamam Users",
    driversOnly: "Sirf Drivers",
    customersOnly: "Sirf Customers",
    loading: "Loading...",
  },
  en: {
    liveMap: "Live Map",
    description: "View live locations of all active users.",
    filterUsers: "Filter users",
    allUsers: "All Users",
    driversOnly: "Drivers Only",
    customersOnly: "Customers Only",
    loading: "Loading...",
  }
}

// Define the User type, including the location property
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'Driver' | 'Customer';
  status: 'Active' | 'Inactive';
  vehicle?: {
      make: string;
      model: string;
      licensePlate: string;
  };
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
  const { language } = useLanguage();
  const t = translations[language];

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
      const position: [number, number] = loc
        ? ('latitude' in loc ? [loc.latitude, loc.longitude] : [24.86, 67.01])
        : [24.86, 67.01];

      const vehicleInfo = user.type === 'Driver' && user.vehicle
        ? `<div class="mt-2 pt-2 border-t border-gray-200">
             <p class="font-semibold text-gray-700">Vehicle:</p>
             <p class="text-sm">${user.vehicle.make} ${user.vehicle.model}</p>
             <p class="text-sm font-mono bg-gray-200 px-1.5 py-0.5 rounded-sm inline-block">${user.vehicle.licensePlate}</p>
           </div>`
        : '';
      
      const popupContent = `
        <div class="p-1 font-sans">
          <h3 class="font-bold text-lg mb-1">${user.name}</h3>
          <p class="text-sm text-gray-500">${user.type}</p>
          <hr class="my-2" />
          <div class="space-y-1 text-sm">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
          </div>
          ${vehicleInfo}
        </div>
      `;

      return {
        position: position,
        popupText: popupContent,
        icon: user.type === 'Driver' ? carIcon : customerIcon,
      };
    });
  }, [filteredUsers]);

  return (
    <div className="flex flex-col h-full gap-4">
       <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>{t.liveMap}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <div className="w-[180px]">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterUsers} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allUsers}</SelectItem>
                <SelectItem value="driver">{t.driversOnly}</SelectItem>
                <SelectItem value="customer">{t.customersOnly}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex-1 h-[calc(100vh-20rem)]">
        <CardContent className="h-full p-0">
          {loading ? (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          ) : (
            <div className="w-full h-full rounded-b-lg overflow-hidden">
              <DynamicMap markers={mapMarkers} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
