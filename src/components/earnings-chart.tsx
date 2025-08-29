
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/context/LanguageContext";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartDataUr = [
  { day: "Som", earnings: 2800 },
  { day: "Mangal", earnings: 3200 },
  { day: "Budh", earnings: 2500 },
  { day: "Jumma", earnings: 4100 },
  { day: "Hafta", earnings: 5200 },
  { day: "Itwar", earnings: 4800 },
  { day: "Aaj", earnings: 4250 },
]

const chartDataEn = [
  { day: "Mon", earnings: 2800 },
  { day: "Tue", earnings: 3200 },
  { day: "Wed", earnings: 2500 },
  { day: "Fri", earnings: 4100 },
  { day: "Sat", earnings: 5200 },
  { day: "Sun", earnings: 4800 },
  { day: "Today", earnings: 4250 },
]


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
  const chartData = language === 'ur' ? chartDataUr : chartDataEn;
  const chartConfig = language === 'ur' ? chartConfigUr : chartConfigEn;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[300px]">
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
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickFormatter={(value) => `PKR ${value / 1000}k`}
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
