
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EarningsChart } from "@/components/earnings-chart";
import { DollarSign, Goal, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const translations = {
  ur: {
    todaysEarnings: "Aaj Ki Kamai",
    fromYesterday: "+0% pichle din se",
    thisWeekEarnings: "Is Haftay Ki Kamai",
    fromLastWeek: "+0% pichle haftay se",
    weeklyGoal: "Haftawar Had",
    goalCompleted: "0% hadaf mukammal",
    earningsOverview: "Kamai Ka Jaiza",
    last7Days: "Pichle 7 dinon ki kamai.",
  },
  en: {
    todaysEarnings: "Today's Earnings",
    fromYesterday: "+0% from yesterday",
    thisWeekEarnings: "This Week's Earnings",
    fromLastWeek: "+0% from last week",
    weeklyGoal: "Weekly Goal",
    goalCompleted: "0% goal completed",
    earningsOverview: "Earnings Overview",
    last7Days: "Earnings for the last 7 days.",
  },
};

export default function EarningsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:gap-8">
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
