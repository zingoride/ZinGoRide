
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, DollarSign, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, rides: 2400 },
  { name: 'Feb', revenue: 3000, rides: 1398 },
  { name: 'Mar', revenue: 2000, rides: 9800 },
  { name: 'Apr', revenue: 2780, rides: 3908 },
  { name: 'May', revenue: 1890, rides: 4800 },
  { name: 'Jun', revenue: 2390, rides: 3800 },
  { name: 'Jul', revenue: 3490, rides: 4300 },
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
    ridesAndRevenue: "Rides aur Aamdani"
  },
  en: {
    dashboard: "Admin Dashboard",
    overview: "Overview",
    totalRevenue: "Total Revenue",
    totalRides: "Total Rides",
    totalUsers: "Total Users",
    totalDrivers: "Total Drivers",
    monthlyOverview: "Monthly Overview",
    ridesAndRevenue: "Rides and Revenue"
  }
};

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">{t.dashboard}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 1,250,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRides}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalDrivers}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+234</div>
            <p className="text-xs text-muted-foreground">+21% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.monthlyOverview}</CardTitle>
          <CardDescription>{t.ridesAndRevenue}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rides" fill="hsl(var(--primary))" />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

