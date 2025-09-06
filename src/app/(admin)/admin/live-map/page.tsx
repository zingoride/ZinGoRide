
'use client';

import { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Car, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  }
};

type UserType = 'Driver' | 'Customer';
type DriverStatus = 'Online' | 'Offline' | 'On Trip';
type CustomerStatus = 'Idle' | 'Searching' | 'On Trip';

interface TrackedUser {
  id: string;
  name: string;
  type: UserType;
  status: DriverStatus | CustomerStatus;
  position: { lat: number; lng: number };
}

const initialUsers: TrackedUser[] = [
  { id: 'driver-1', name: 'Babar Khan', type: 'Driver', status: 'Online', position: { lat: 24.8607, lng: 67.0011 } },
  { id: 'driver-2', name: 'Dawood Saleem', type: 'Driver', status: 'On Trip', position: { lat: 24.885, lng: 67.04 } },
  { id: 'driver-3', name: 'Zainab Ansari', type: 'Driver', status: 'Offline', position: { lat: 24.92, lng: 67.08 } },
  { id: 'cust-1', name: 'Ahmad Ali', type: 'Customer', status: 'Idle', position: { lat: 24.89, lng: 67.02 } },
  { id: 'cust-2', name: 'Fatima Jilani', type: 'Customer', status: 'On Trip', position: { lat: 24.8855, lng: 67.0405 } },
];

const statusStyles = {
  'Online': 'bg-green-500',
  'Offline': 'bg-gray-500',
  'On Trip': 'bg-blue-500',
  'Idle': 'bg-gray-500',
  'Searching': 'bg-yellow-500',
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 24.8607, // Karachi
  lng: 67.0011,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        // Using a modern, clean map style
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
  const [users, setUsers] = useState<TrackedUser[]>(initialUsers);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const driverIcon = useMemo(() => ({
    path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-1.5 1.5-1.5zM5 11l1.5-4.5h11L19 11H5z',
    fillColor: 'hsl(var(--primary))',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 1.5,
    anchor: new window.google.maps.Point(12, 12),
  }), []);

  const customerIcon = useMemo(() => ({
     path: window.google.maps.SymbolPath.CIRCLE,
     fillColor: 'hsl(var(--accent))',
     fillOpacity: 1,
     strokeColor: 'white',
     strokeWeight: 2,
     scale: 8
  }), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.status === 'Offline' || user.status === 'Idle') return user;
          // Simulate more realistic movement along roads
          const newLat = user.position.lat + (Math.random() - 0.5) * 0.001;
          const newLng = user.position.lng + (Math.random() - 0.5) * 0.001;
          return {
            ...user,
            position: { lat: newLat, lng: newLng },
          };
        })
      );
    }, 3000); // Update every 3 seconds

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
            zoom={13}
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
                      <p>Status: <Badge variant="secondary" className={statusStyles[user.status]}>{user.status}</Badge></p>
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
