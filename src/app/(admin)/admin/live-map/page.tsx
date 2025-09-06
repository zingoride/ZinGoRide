
'use client';

import { useMemo, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Car, Users } from 'lucide-react';
import type { User as UserType } from '../users/page';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Icon } from 'leaflet';

const generateRandomPosition = (baseLat: number, baseLng: number): [number, number] => {
  const lat = baseLat + (Math.random() - 0.5) * 0.1;
  const lng = baseLng + (Math.random() - 0.5) * 0.1;
  return [lat, lng];
};

const LiveMapPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then(leaflet => setL(leaflet));

    const fetchUsers = async () => {
      setLoading(true);
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserType));
      setUsers(usersList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const driverIcon = useMemo((): Icon | null => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: '/car-pin.png',
      iconRetinaUrl: '/car-pin.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    });
  }, [L]);

  const customerIcon = useMemo((): Icon | null => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: '/customer-pin.png',
      iconRetinaUrl: '/customer-pin.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    });
  }, [L]);

  const filteredUsers = useMemo(() => {
    if (filter === 'all') return users;
    return users.filter(user => user.type.toLowerCase() === filter);
  }, [filter, users]);

  const renderMap = () => {
    if (!isClient || !L || loading) {
       return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="w-full h-[calc(100vh-10rem)]" />
        </div>
       )
    }

    return (
        <MapContainer center={[24.9, 67.1]} zoom={12} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredUsers.map(user => {
            const position = generateRandomPosition(24.9, 67.1); // Karachi base coordinates
            const icon = user.type === 'Driver' ? driverIcon : customerIcon;

            if (!icon) return null;

            return (
                <Marker key={user.id} position={position} icon={icon}>
                <Popup>
                    <b>{user.name}</b><br/>
                    {user.email}<br/>
                    Status: {user.approvalStatus}
                </Popup>
                </Marker>
            )
            })}
        </MapContainer>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Live Fleet Overview</CardTitle>
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
      <div className="flex-1 w-full h-full rounded-lg overflow-hidden border">
        {renderMap()}
      </div>
    </div>
  );
};

export default LiveMapPage;
