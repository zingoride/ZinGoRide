
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { User } from '@/app/(admin)/admin/users/page';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix for default icon paths in Leaflet with bundlers like Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const translations = {
  ur: {
    title: "Live Fleet & Customer Map",
    description: "Real-time mein tamam drivers aur customers ki location dekhein.",
    loadingMap: "Map load ho raha hai...",
    driver: "Driver",
    customer: "Customer",
    status: "Status"
  },
  en: {
    title: "Live Fleet & Customer Map",
    description: "View the real-time location of all drivers and customers.",
    loadingMap: "Loading map...",
    driver: "Driver",
    customer: "Customer",
    status: "Status"
  }
};

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });


const generateRandomPosition = (baseLat: number, baseLng: number): [number, number] => {
    return [
        baseLat + (Math.random() - 0.5) * 0.1,
        baseLng + (Math.random() - 0.5) * 0.1,
    ];
};

const driverIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const customerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function LiveMapPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [users, setUsers] = useState<(User & { position: [number, number] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => {
            const userData = { id: doc.id, ...doc.data() } as User;
            return {
                ...userData,
                position: generateRandomPosition(24.8607, 67.0011) // Karachi coordinates
            };
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);
  
  return (
    <div className="flex flex-col h-full gap-4">
        <Card>
            <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
            </CardHeader>
        </Card>
        <div className="flex-1 w-full h-full rounded-lg overflow-hidden border">
            <MapContainer center={[24.8607, 67.0011]} zoom={12} scrollWheelZoom={true} style={{height: '100%', width: '100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {users.map(user => (
                    <Marker 
                        key={user.id} 
                        position={user.position}
                        icon={user.type === 'Driver' ? driverIcon : customerIcon}
                    >
                        <Popup>
                            <b>{user.name}</b><br/>
                            {user.type === 'Driver' ? t.driver : t.customer}<br/>
                            {t.status}: {user.approvalStatus}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    </div>
  );
}

export default LiveMapPage;
