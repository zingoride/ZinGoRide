
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Loader2 } from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfigUr = {
  earnings: {
    label: "Kamai (PKR)",
    color: "hsl(var(--primary))",
  },
}

const chartConfigEn = {
  earnings: {
    label: "Earnings (PKR)",
    color: "hsl(var(--primary))",
  },
}

export function EarningsChart() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [chartData, setChartData] = useState<{ day: string; earnings: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const t = language === 'ur' ? chartConfigUr : chartConfigEn;

  useEffect(() => {
    const fetchLast7DaysEarnings = async () => {
      if (!user) return;
      setLoading(true);

      const data: { day: string; earnings: number }[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const start = startOfDay(date);
        const end = endOfDay(date);
        
        const ridesRef = collection(db, "rides");
        const q = query(
          ridesRef,
          where("driverId", "==", user.uid),
          where("status", "==", "completed"),
          where("createdAt", ">=", Timestamp.fromDate(start)),
          where("createdAt", "<=", Timestamp.fromDate(end))
        );
        
        const querySnapshot = await getDocs(q);
        let dailyEarnings = 0;
        querySnapshot.forEach(doc => {
          dailyEarnings += (doc.data().fare || 0) * 0.85; // Net earnings
        });
        
        data.push({
          day: i === 0 ? (language === 'ur' ? "Aaj" : "Today") : format(date, 'E'),
          earnings: dailyEarnings
        });
      }
      
      setChartData(data);
      setLoading(false);
    };

    fetchLast7DaysEarnings();
  }, [user, language]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-[300px] w-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <ChartContainer config={t} className="min-h-[200px] w-full h-[300px]">
      <BarChart 
        accessibilityLayer 
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(value) => `PKR ${value > 1000 ? `${value/1000}k` : value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
