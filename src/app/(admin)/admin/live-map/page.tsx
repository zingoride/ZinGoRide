
'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Car, Users, Circle, Loader2 } from 'lucide-react';
import type { User as UserType } from '../users/page';
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import 'leaflet/dist/leaflet.css';

const LiveMapPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Dynamically import the map component only on the client side
  const MapContainer = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
      ssr: false,
      loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
  }), []);
  const TileLayer = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }), []);
  const Marker = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }), []);
  const Popup = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }), []);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => {
      setL(leaflet);
      // Fix for default icon paths
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    });
  }, []);

  useEffect(() => {
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

  const generateRandomPosition = (baseLat: number, baseLng: number, index: number): [number, number] => {
    const spread = 0.1;
    return [baseLat + (Math.random() - 0.5) * spread * (index + 1), baseLng + (Math.random() - 0.5) * spread * (index+1)];
  };

  const getIcon = (userType: 'Driver' | 'Customer') => {
    if (!L) return new (L || window.L).Icon.Default();

    const iconHtml = userType === 'Driver' 
        ? `<div style="font-size: 24px;">🚖</div>` 
        : `<div style="font-size: 24px;">👤</div>`;

    return L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-none',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    });
  };

  if (loading || !L) {
     return (
        <div className="flex flex-col h-full gap-4">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
            </Card>
            <Card className="flex-1 w-full">
                 <Skeleton className="h-full w-full" />
            </Card>
        </div>
     )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
       <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
             <CardTitle>Live Fleet Overview</CardTitle>
             <CardDescription>View all active users on the map.</CardDescription>
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
      <Card className="flex-1 w-full h-full rounded-lg overflow-hidden border">
        <MapContainer center={[24.8607, 67.0011]} zoom={12} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredUsers.map((user, index) => {
            const position = generateRandomPosition(24.8607, 67.0011, index);
            return (
                <Marker key={user.id} position={position} icon={getIcon(user.type)}>
                    <Popup>
                        <div className="font-semibold">{user.name}</div>
                        <div>{user.type} - {user.status}</div>
                    </Popup>
                </Marker>
            )
          })}
        </MapContainer>
      </Card>
    </div>
  );
};

export default LiveMapPage;
