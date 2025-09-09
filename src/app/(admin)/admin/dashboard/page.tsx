
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, DollarSign, Percent, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

interface Stats {
  totalRevenue: number;
  totalCommission: number;
  totalRides: number;
  totalUsers: number;
  totalDrivers: number;
  revenueLastMonth: number;
  ridesLastMonth: number;
  usersLastMonth: number;
  driversLastMonth: number;
}

interface MonthlyData {
    name: string;
    revenue: number;
    rides: number;
}

const translations = {
  ur: {
    dashboard: "Admin Dashboard",
    overview: "Jaiza",
    totalRevenue: "Kul Aamdani",
    totalRides: "Kul Rides",
    totalUsers: "Kul Sarfeen",
    totalDrivers: "Kul Drivers",
    monthlyOverview: "Mahanah Jaiza",
    ridesAndRevenue: "Rides aur Aamdani",
    totalCommission: "Kul Commission",
    fromLastMonth: "pichle mahine se",
    loading: "Loading...",
  },
  en: {
    dashboard: "Admin Dashboard",
    overview: "Overview",
    totalRevenue: "Total Revenue",
    totalRides: "Total Rides",
    totalUsers: "Total Users",
    totalDrivers: "Total Drivers",
    monthlyOverview: "Monthly Overview",
    ridesAndRevenue: "Rides and Revenue",
    totalCommission: "Total Commission",
    fromLastMonth: "from last month",
    loading: "Loading...",
  }
};

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try {
            const now = new Date();
            const startOfThisMonth = startOfMonth(now);
            const startOfLastMonth = startOfMonth(subMonths(now, 1));
            const endOfLastMonth = endOfMonth(subMonths(now, 1));

            // --- User Stats ---
            const usersCollection = collection(db, 'users');
            const allUsersSnapshot = await getDocs(usersCollection);
            const totalUsers = allUsersSnapshot.size;
            const totalDrivers = allUsersSnapshot.docs.filter(doc => doc.data().type === 'Driver').length;

            const lastMonthUsersQuery = query(usersCollection, where('createdAt', '>=', startOfLastMonth), where('createdAt', '<=', endOfLastMonth));
            const lastMonthUsersSnapshot = await getDocs(lastMonthUsersQuery);
            const usersLastMonth = lastMonthUsersSnapshot.size;
            const driversLastMonth = lastMonthUsersSnapshot.docs.filter(doc => doc.data().type === 'Driver').length;

            // --- Ride Stats ---
            const ridesCollection = collection(db, 'rides');
            const completedRidesQuery = query(ridesCollection, where('status', '==', 'completed'));
            const allRidesSnapshot = await getDocs(completedRidesQuery);

            let totalRevenue = 0;
            let totalRides = 0;
            let revenueLastMonth = 0;
            let ridesLastMonth = 0;
            const monthlyData: { [key: string]: { revenue: number, rides: number } } = {};

            allRidesSnapshot.forEach(doc => {
                const ride = doc.data();
                const fare = ride.fare || 0;
                const rideDate = (ride.createdAt as Timestamp).toDate();

                // Aggregate totals
                totalRevenue += fare;
                totalRides++;

                // Aggregate by month for chart
                const monthName = format(rideDate, 'MMM');
                if (!monthlyData[monthName]) {
                    monthlyData[monthName] = { revenue: 0, rides: 0 };
                }
                monthlyData[monthName].revenue += fare;
                monthlyData[monthName].rides++;

                // Aggregate for last month's comparison
                if (rideDate >= startOfLastMonth && rideDate <= endOfLastMonth) {
                    revenueLastMonth += fare;
                    ridesLastMonth++;
                }
            });
            
            const totalCommission = totalRevenue * 0.15;

            const formattedChartData = Object.entries(monthlyData).map(([name, data]) => ({
                name,
                revenue: data.revenue,
                rides: data.rides
            })).sort((a, b) => new Date(`01-${a.name}-2020`).getMonth() - new Date(`01-${b.name}-2020`).getMonth());


            setStats({
                totalRevenue,
                totalCommission,
                totalRides,
                totalUsers,
                totalDrivers,
                revenueLastMonth,
                ridesLastMonth,
                usersLastMonth,
                driversLastMonth
            });
            setChartData(formattedChartData);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);
  
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

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">{t.dashboard}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">PKR {stats?.totalRevenue.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">
                {renderPercentage(getPercentageChange(stats?.totalRevenue || 0, stats?.revenueLastMonth || 0))} {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalCommission}</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">PKR {stats?.totalCommission.toFixed(2) || 0}</div>
             <p className="text-xs text-muted-foreground">
                {renderPercentage(getPercentageChange(stats?.totalCommission || 0, (stats?.revenueLastMonth || 0) * 0.15))} {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRides}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats?.totalRides || 0}</div>
             <p className="text-xs text-muted-foreground">
                {renderPercentage(getPercentageChange(stats?.totalRides || 0, stats?.ridesLastMonth || 0))} {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
                {renderPercentage(getPercentageChange(stats?.totalUsers || 0, stats?.usersLastMonth || 0))} {t.fromLastMonth}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.monthlyOverview}</CardTitle>
          <CardDescription>{t.ridesAndRevenue}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(var(--primary))" fontSize={12} tickFormatter={(val) => `PKR ${val/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name={t.totalRevenue} stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="rides" name={t.totalRides} stroke="hsl(var(--secondary-foreground))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

    