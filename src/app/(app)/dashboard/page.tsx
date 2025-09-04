
'use client';

import { useState, useEffect } from 'react';
import { RideRequest as RideRequestComponent } from '@/components/ride-request';
import { useRiderStatus } from '@/context/RiderStatusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, DollarSign, Wallet, Goal } from 'lucide-react';
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
    goOnlineToReceive: "Nayi ride requests hasil karne ke liye online jayen.",
    goOnline: "Go Online",
    todaysEarnings: "Aaj Ki Kamai",
    fromYesterday: "+0% pichle din se",
    thisWeekEarnings: "Is Haftay Ki Kamai",
    fromLastWeek: "+0% pichle haftay se",
    weeklyGoal: "Haftawar Had",
    goalCompleted: "0% hadaf mukammal"
  },
  en: {
    youAreOffline: "You are Offline",
    goOnlineToReceive: "Go online to receive new ride requests.",
    goOnline: "Go Online",
    todaysEarnings: "Today's Earnings",
    fromYesterday: "+0% from yesterday",
    thisWeekEarnings: "This Week's Earnings",
    fromLastWeek: "+0% from last week",
    weeklyGoal: "Weekly Goal",
    goalCompleted: "0% goal completed"
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

  if (!isOnline) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <WifiOff className="h-8 w-8 text-destructive" />
              <span>{t.youAreOffline}</span>
            </CardTitle>
            <CardDescription>
              {t.goOnlineToReceive}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={toggleStatus} size="lg" className="w-full">
              {t.goOnline}
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid w-full gap-4 md:gap-8">
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

  if (activeRide) {
    return <InProgressRide />;
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
        <div className="flex flex-col items-center justify-center text-center gap-4 h-[50vh]">
            <h2 className="text-2xl font-semibold">Searching for rides...</h2>
            <p className="text-muted-foreground">You are online. New ride requests will appear here.</p>
        </div>
      )}
    </div>
  );
}
