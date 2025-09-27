
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EarningsChart } from "@/components/earnings-chart";
import { DollarSign, Goal, Wallet, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { startOfToday, startOfWeek, endOfWeek, isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';

interface EarningsStats {
    today: number;
    thisWeek: number;
    yesterday: number;
    lastWeek: number;
}

const WEEKLY_GOAL = 30000;

const translations = {
  ur: {
    todaysEarnings: "Aaj Ki Kamai",
    fromYesterday: "pichle din se",
    thisWeekEarnings: "Is Haftay Ki Kamai",
    fromLastWeek: "pichle haftay se",
    weeklyGoal: "Haftawar Had",
    goalCompleted: (percentage: number) => `${percentage.toFixed(0)}% hadaf mukammal`,
    earningsOverview: "Kamai Ka Jaiza",
    last7Days: "Pichle 7 dinon ki kamai.",
    loading: "Kamai load ho rahi hai...",
  },
  en: {
    todaysEarnings: "Today's Earnings",
    fromYesterday: "from yesterday",
    thisWeekEarnings: "This Week's Earnings",
    fromLastWeek: "from last week",
    weeklyGoal: "Weekly Goal",
    goalCompleted: (percentage: number) => `${percentage.toFixed(0)}% goal completed`,
    earningsOverview: "Earnings Overview",
    last7Days: "Earnings for the last 7 days.",
    loading: "Loading earnings...",
  },
};

export default function EarningsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { user } = useAuth();
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      if (!user) return;
      setLoading(true);

      try {
        const ridesRef = collection(db, "rides");
        const q = query(
          ridesRef, 
          where("driverId", "==", user.uid), 
          where("status", "==", "completed")
        );
        
        const querySnapshot = await getDocs(q);

        const today = new Date();
        const yesterday = subDays(today, 1);
        const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
        const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
        const startOfLastWeek = startOfWeek(yesterday, { weekStartsOn: 1 });
        const endOfLastWeek = endOfWeek(yesterday, { weekStartsOn: 1 });
        
        let todaysEarnings = 0;
        let yesterdaysEarnings = 0;
        let thisWeekEarnings = 0;
        let lastWeekEarnings = 0;

        querySnapshot.forEach(doc => {
          const ride = doc.data();
          const rideDate = (ride.createdAt as Timestamp).toDate();
          const netEarning = (ride.fare || 0) * 0.85; // fare - 15% commission

          if (isWithinInterval(rideDate, { start: startOfDay(today), end: endOfDay(today) })) {
            todaysEarnings += netEarning;
          }
          if (isWithinInterval(rideDate, { start: startOfDay(yesterday), end: endOfDay(yesterday) })) {
            yesterdaysEarnings += netEarning;
          }
          if (isWithinInterval(rideDate, { start: startOfThisWeek, end: endOfThisWeek })) {
            thisWeekEarnings += netEarning;
          }
          if (isWithinInterval(rideDate, { start: startOfLastWeek, end: endOfLastWeek })) {
            lastWeekEarnings += netEarning;
          }
        });

        setStats({
          today: todaysEarnings,
          thisWeek: thisWeekEarnings,
          yesterday: yesterdaysEarnings,
          lastWeek: lastWeekEarnings,
        });

      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEarnings();
  }, [user]);

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const renderPercentage = (change: number) => {
    const roundedChange = change.toFixed(0);
    if (change > 0) {
      return <span className="text-green-600">+{roundedChange}%</span>;
    } else if (change < 0) {
      return <span className="text-red-600">{roundedChange}%</span>;
    }
    return <span>{roundedChange}%</span>;
  };
  
  const weeklyGoalProgress = stats ? (stats.thisWeek / WEEKLY_GOAL) * 100 : 0;

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-2">{t.loading}</span></div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.todaysEarnings}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {stats?.today.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {renderPercentage(getPercentageChange(stats?.today || 0, stats?.yesterday || 0))} {t.fromYesterday}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.thisWeekEarnings}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {stats?.thisWeek.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {renderPercentage(getPercentageChange(stats?.thisWeek || 0, stats?.lastWeek || 0))} {t.fromLastWeek}
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.weeklyGoal}</CardTitle>
            <Goal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {WEEKLY_GOAL.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mb-2">
              {t.goalCompleted(weeklyGoalProgress)}
            </p>
            <Progress value={weeklyGoalProgress} aria-label={`${weeklyGoalProgress}% complete`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.earningsOverview}</CardTitle>
            <CardDescription>{t.last7Days}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EarningsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
