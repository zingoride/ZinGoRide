
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Car, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  position: { top: string; left: string };
}

const initialUsers: TrackedUser[] = [
  { id: 'driver-1', name: 'Babar Khan', type: 'Driver', status: 'Online', position: { top: '20%', left: '30%' } },
  { id: 'driver-2', name: 'Dawood Saleem', type: 'Driver', status: 'On Trip', position: { top: '50%', left: '60%' } },
  { id: 'driver-3', name: 'Zainab Ansari', type: 'Driver', status: 'Offline', position: { top: '80%', left: '10%' } },
  { id: 'cust-1', name: 'Ahmad Ali', type: 'Customer', status: 'Idle', position: { top: '15%', left: '75%' } },
  { id: 'cust-2', name: 'Fatima Jilani', type: 'Customer', status: 'On Trip', position: { top: '52%', left: '65%' } },
];

const statusStyles = {
  'Online': 'bg-green-500',
  'Offline': 'bg-gray-500',
  'On Trip': 'bg-blue-500',
  'Idle': 'bg-gray-500',
  'Searching': 'bg-yellow-500',
}

export default function LiveMapPage() {
  const [users, setUsers] = useState<TrackedUser[]>(initialUsers);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.status === 'Offline' || user.status === 'Idle') return user;
          const newTop = Math.max(5, Math.min(95, parseFloat(user.position.top) + (Math.random() - 0.5) * 2));
          const newLeft = Math.max(5, Math.min(95, parseFloat(user.position.left) + (Math.random() - 0.5) * 2));
          return {
            ...user,
            position: { top: `${newTop}%`, left: `${newLeft}%` },
          };
        })
      );
    }, 2000); // Update every 2 seconds

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
      <div className="flex-1 w-full h-full rounded-lg overflow-hidden relative border">
        <Image
          src="https://picsum.photos/seed/citymap/1600/1200"
          alt="Live Map"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-80"
          data-ai-hint="street map aerial"
        />
        <TooltipProvider>
          {users.map(user => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
                  style={{ top: user.position.top, left: user.position.left }}
                >
                    <div className="relative">
                        {user.type === 'Driver' ? (
                            <Car className={cn("h-8 w-8 text-primary drop-shadow-lg", user.status === 'Offline' && 'text-gray-500 opacity-60')} />
                        ) : (
                            <User className={cn("h-8 w-8 text-rose-500 drop-shadow-lg", user.status === 'Idle' && 'text-gray-500 opacity-60')} />
                        )}
                         <span className={cn("absolute -top-1 -right-1 block h-3 w-3 rounded-full border-2 border-background", statusStyles[user.status])} />
                    </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{user.name}</p>
                <p>Status: <span className="font-semibold">{user.status}</span></p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
