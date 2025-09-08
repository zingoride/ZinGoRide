
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, DollarSign, Percent, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

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
            // Fetch users
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const totalUsers = usersSnapshot.size;
            const totalDrivers = usersSnapshot.docs.filter(doc => doc.data().type === 'Driver').length;

            // Fetch rides
            const ridesSnapshot = await getDocs(query(collection(db, 'rides'), where('status', '==', 'completed')));
            let totalRevenue = 0;
            let totalRides = 0;
            const monthlyData: { [key: string]: { revenue: number, rides: number } } = {};

            ridesSnapshot.forEach(doc => {
                const ride = doc.data();
                const fare = ride.fare || 0;
                totalRevenue += fare;
                totalRides++;
                
                if (ride.createdAt) {
                    const date = (ride.createdAt as Timestamp).toDate();
                    const monthName = format(date, 'MMM');
                    if (!monthlyData[monthName]) {
                        monthlyData[monthName] = { revenue: 0, rides: 0 };
                    }
                    monthlyData[monthName].revenue += fare;
                    monthlyData[monthName].rides++;
                }
            });
            
            const totalCommission = totalRevenue * 0.15;

            const formattedChartData = Object.entries(monthlyData).map(([name, data]) => ({
                name,
                revenue: data.revenue,
                rides: data.rides
            }));

            setStats({
                totalRevenue,
                totalCommission,
                totalRides,
                totalUsers,
                totalDrivers,
                revenueLastMonth: 0, 
                ridesLastMonth: 0,
                usersLastMonth: 0,
                driversLastMonth: 0
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
  }

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
                +{getPercentageChange(stats?.totalRevenue || 0, stats?.revenueLastMonth || 0).toFixed(0)}% {t.fromLastMonth}
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
                +{getPercentageChange(stats?.totalCommission || 0, stats?.revenueLastMonth * 0.15 || 0).toFixed(0)}% {t.fromLastMonth}
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
                +{getPercentageChange(stats?.totalRides || 0, stats?.ridesLastMonth || 0).toFixed(0)}% {t.fromLastMonth}
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
                +{getPercentageChange(stats?.totalUsers || 0, stats?.usersLastMonth || 0).toFixed(0)}% {t.fromLastMonth}
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rides" fill="hsl(var(--primary))" name={t.totalRides} />
              <Bar dataKey="revenue" fill="hsl(var(--secondary))" name={t.totalRevenue} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
