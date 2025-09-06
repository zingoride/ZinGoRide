'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { User } from '@/app/(admin)/admin/users/page';

import 'leaflet/dist/leaflet.css';


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

const MapComponent = dynamic(() => import('@/components/live-map-component'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-muted"><p>Loading map...</p></div>,
});


const generateRandomPosition = (baseLat: number, baseLng: number): [number, number] => {
    return [
        baseLat + (Math.random() - 0.5) * 0.1,
        baseLng + (Math.random() - 0.5) * 0.1,
    ];
};

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
            <MapComponent users={users} translations={t} />
        </div>
    </div>
  );
}

export default LiveMapPage;
