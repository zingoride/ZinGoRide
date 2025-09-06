
'use client';

import { useState, useEffect } from 'react';
import { RideRequest as RideRequestComponent } from '@/components/ride-request';
import { useRiderStatus } from '@/context/RiderStatusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, DollarSign, Wallet, Goal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRide } from '@/context/RideContext';
import { InProgressRide } from '@/components/in-progress-ride';
import { RideInvoice } from '@/components/ride-invoice';
import { useLanguage } from '@/context/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import type { RideRequest } from '@/lib/types';


const translations = {
  ur: {
    youAreOffline: "Aap Offline Hain",
    youAreOnline: "Aap Online Hain",
    goOnlineToReceive: "Nayi ride requests hasil karne ke liye online jayen.",
    goOnline: "Go Online",
    goOffline: "Go Offline",
    todaysEarnings: "Aaj Ki Kamai",
    fromYesterday: "+0% pichle din se",
    thisWeekEarnings: "Is Haftay Ki Kamai",
    fromLastWeek: "+0% pichle haftay se",
    weeklyGoal: "Haftawar Had",
    goalCompleted: "0% hadaf mukammal",
    searchingForRides: "Rides dhoondi ja rahi hain...",
    newRideRequestsWillAppear: "Aap online hain. Nayi ride requests yahan nazar aayengi."
  },
  en: {
    youAreOffline: "You are Offline",
    youAreOnline: "You are Online",
    goOnlineToReceive: "Go online to receive new ride requests.",
    goOnline: "Go Online",
    goOffline: "Go Offline",
    todaysEarnings: "Today's Earnings",
    fromYesterday: "+0% from yesterday",
    thisWeekEarnings: "This Week's Earnings",
    fromLastWeek: "+0% from last week",
    weeklyGoal: "Weekly Goal",
    goalCompleted: "0% goal completed",
    searchingForRides: "Searching for rides...",
    newRideRequestsWillAppear: "You are online. New ride requests will appear here."
  }
}

export default function Dashboard() {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const { isOnline, toggleStatus } = useRiderStatus();
  const { activeRide, completedRide } = useRide();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    if (!isOnline) {
      setRideRequests([]);
      return;
    }

    const q = query(collection(db, "rides"), where("status", "==", "booked"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests: RideRequest[] = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() } as RideRequest);
        });
        setRideRequests(requests);
    });

    return () => unsubscribe();
  }, [isOnline]);

  if (completedRide) {
    return <RideInvoice ride={completedRide} />;
  }
  
  if (activeRide) {
    return <InProgressRide />;
  }

  if (!isOnline) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <WifiOff className="h-24 w-24 text-muted-foreground" />
        <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t.youAreOffline}</h1>
            <p className="text-muted-foreground">{t.goOnlineToReceive}</p>
        </div>
        
        <Button onClick={toggleStatus} size="lg" className="w-full max-w-sm">
          {t.goOnline}
        </Button>
        
        <div className="grid w-full max-w-sm gap-4 md:gap-8 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.todaysEarnings}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PKR 0</div>
                <p className="text-xs text-muted-foreground">
                  {t.fromYesterday}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.thisWeekEarnings}</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PKR 0</div>
                <p className="text-xs text-muted-foreground">
                  {t.fromLastWeek}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.weeklyGoal}</CardTitle>
                <Goal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PKR 30,000</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {t.goalCompleted}
                </p>
                <Progress value={0} aria-label="0% complete" />
              </CardContent>
            </Card>
        </div>
      </div>
    );
  }


  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      {rideRequests.length > 0 ? (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <div className="grid gap-4">
            {rideRequests.map((request) => (
              <RideRequestComponent key={request.id} {...request} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-4 h-[calc(100vh-12rem)]">
            <div className="relative">
              <Wifi className="h-24 w-24 text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-12 w-12 bg-primary/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold">{t.searchingForRides}</h2>
            <p className="text-muted-foreground">{t.newRideRequestsWillAppear}</p>
        </div>
      )}
    </div>
  );
}
