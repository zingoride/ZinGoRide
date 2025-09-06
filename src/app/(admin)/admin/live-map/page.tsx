
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { Car, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/app/(admin)/admin/users/page';
import { renderToStaticMarkup } from 'react-dom/server';

const translations = {
  ur: {
    title: "Live Fleet & Customer Map",
    description: "Tamam active drivers aur customers ki live location dekhein.",
    legend: "Legend",
    driver: "Driver",
    customer: "Customer",
    driverStatus: "Driver Status",
    customerStatus: "Customer Status",
    online: "Online",
    offline: "Offline",
    onTrip: "On Trip",
    searching: "Searching",
    loadingMap: "Naqsha load ho raha hai...",
    errorFetchingUsers: "Users fetch karne mein masla hua."
  },
  en: {
    title: "Live Fleet & Customer Map",
    description: "View the live location of all active drivers and customers.",
    legend: "Legend",
    driver: "Driver",
    customer: "Customer",
    driverStatus: "Driver Status",
    customerStatus: "Customer Status",
    online: "Online",
    offline: "Offline",
    onTrip: "On Trip",
    searching: "Searching",
    loadingMap: "Loading map...",
    errorFetchingUsers: "Error fetching users."
  }
};

type UserType = 'Driver' | 'Customer';
type DriverStatus = 'Online' | 'Offline' | 'On Trip' | 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
type CustomerStatus = 'Idle' | 'Searching' | 'On Trip' | 'Active' | 'Inactive';

interface TrackedUser {
  id: string;
  name: string;
  type: UserType;
  status: DriverStatus | CustomerStatus;
  position: { lat: number; lng: number };
}

// Karachi coordinates for random generation
const KARACHI_BOUNDS = {
  north: 25.1,
  south: 24.8,
  west: 66.9,
  east: 67.4,
};


const statusStyles = {
  'Online': 'bg-green-500',
  'Offline': 'bg-gray-500',
  'On Trip': 'bg-blue-500',
  'Idle': 'bg-gray-500',
  'Searching': 'bg-yellow-500',
  'Pending': 'bg-yellow-400',
  'Approved': 'bg-green-600',
  'Rejected': 'bg-red-500',
  'Blocked': 'bg-red-700',
  'Active': 'bg-green-500',
  'Inactive': 'bg-gray-500',
}

const createIcon = (icon: React.ReactElement) => {
    return L.divIcon({
      html: renderToStaticMarkup(icon),
      className: 'bg-transparent border-0',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
};

const driverIcon = createIcon(<Car className="h-8 w-8 text-primary drop-shadow-lg" />);
const customerIcon = createIcon(<User className="h-8 w-8 text-accent-foreground drop-shadow-lg" />);


export default function LiveMapPage() {
  const [users, setUsers] = useState<TrackedUser[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

   useEffect(() => {
     // This ensures that the map component is only rendered on the client side.
     setMapReady(true);
   }, []);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
            
            const trackedUsers = usersList.map(user => ({
                id: user.id,
                name: user.name,
                type: user.type,
                status: user.type === 'Driver' ? user.approvalStatus : user.status,
                position: {
                    lat: KARACHI_BOUNDS.south + Math.random() * (KARACHI_BOUNDS.north - KARACHI_BOUNDS.south),
                    lng: KARACHI_BOUNDS.west + Math.random() * (KARACHI_BOUNDS.east - KARACHI_BOUNDS.west),
                }
            }));
            setUsers(trackedUsers);
        } catch (error) {
            console.error("Error fetching users: ", error);
            toast({ variant: "destructive", title: t.errorFetchingUsers });
        }
    };
    fetchUsers();
  }, [t.errorFetchingUsers, toast]);


  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.status === 'Offline' || user.status === 'Idle' || user.status === 'Rejected' || user.status === 'Blocked' || user.status === 'Inactive') return user;
          const newLat = user.position.lat + (Math.random() - 0.5) * 0.002;
          const newLng = user.position.lng + (Math.random() - 0.5) * 0.002;
          return {
            ...user,
            position: { lat: newLat, lng: newLng },
          };
        })
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    <span>{t.driver}</span>
                </div>
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent-foreground" />
                    <span>{t.customer}</span>
                </div>
            </div>
        </CardContent>
      </Card>
      <div className="flex-1 w-full h-full rounded-lg overflow-hidden border">
         {mapReady ? (
          <MapContainer center={[24.9, 67.1]} zoom={12} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {users.map(user => (
              <Marker
                key={user.id}
                position={[user.position.lat, user.position.lng]}
                icon={user.type === 'Driver' ? driverIcon : customerIcon}
                opacity={user.status === 'Offline' || user.status === 'Idle' ? 0.5 : 1}
              >
                <Popup>
                    <div>
                      <h4 className="font-bold">{user.name}</h4>
                      <p>Status: <Badge variant="secondary" className={(statusStyles as any)[user.status]}>{user.status}</Badge></p>
                    </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Skeleton className="h-full w-full" />
                <p className="absolute text-muted-foreground">{t.loadingMap}</p>
            </div>
        )}
      </div>
    </div>
  );
}
