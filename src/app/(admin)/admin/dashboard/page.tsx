
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, DollarSign, Wallet, Percent } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 0, rides: 0 },
  { name: 'Feb', revenue: 0, rides: 0 },
  { name: 'Mar', revenue: 0, rides: 0 },
  { name: 'Apr', revenue: 0, rides: 0 },
  { name: 'May', revenue: 0, rides: 0 },
  { name: 'Jun', revenue: 0, rides: 0 },
  { name: 'Jul', revenue: 0, rides: 0 },
];


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
  }
};

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];

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
            <div className="text-lg font-bold">PKR 0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalCommission}</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">PKR 0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRides}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rides" fill="hsl(var(--primary))" />
              <Bar dataKey="revenue" fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
