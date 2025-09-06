
'use client';

import { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Car, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/app/(admin)/admin/users/page';

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
    apiKeyError: "Google Maps API Key nahi mili. Baraye meharbani .env file check karein.",
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
    apiKeyError: "Google Maps API Key is missing. Please check your .env file.",
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

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 24.9,
  lng: 67.1,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        {
            "featureType": "poi.business",
            "stylers": [ { "visibility": "off" } ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [ { "visibility": "off" } ]
        },
        {
            "featureType": "transit",
            "stylers": [ { "visibility": "off" } ]
        }
    ]
};

export default function LiveMapPage() {
  const [users, setUsers] = useState<TrackedUser[]>([]);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = translations[language];

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

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

  const driverIcon = useMemo(() => {
    if (typeof window === 'undefined' || !window.google) return null;
    return {
        path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-1.5 1.5-1.5zM5 11l1.5-4.5h11L19 11H5z',
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 12),
    }
  }, []);

  const customerIcon = useMemo(() => {
    if (typeof window === 'undefined' || !window.google) return null;
    return {
     path: window.google.maps.SymbolPath.CIRCLE,
     fillColor: 'hsl(var(--accent))',
     fillOpacity: 1,
     strokeColor: 'white',
     strokeWeight: 2,
     scale: 8
    }
  }, []);

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

  const handleActiveMarker = (markerId: string) => {
    if (markerId === activeMarker) {
      setActiveMarker(null);
    } else {
      setActiveMarker(markerId);
    }
  };


  if (loadError) {
    return (
        <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent><p>{t.apiKeyError}</p></CardContent>
        </Card>
    );
  }

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
         {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={mapOptions}
          >
            {users.map(user => (
              <MarkerF
                key={user.id}
                position={user.position}
                onClick={() => handleActiveMarker(user.id)}
                icon={user.type === 'Driver' ? driverIcon : customerIcon}
                opacity={user.status === 'Offline' || user.status === 'Idle' ? 0.5 : 1}
              >
                {activeMarker === user.id && (
                  <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                    <div>
                      <h4 className="font-bold">{user.name}</h4>
                      <p>Status: <Badge variant="secondary" className={(statusStyles as any)[user.status]}>{user.status}</Badge></p>
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
            ))}
          </GoogleMap>
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
