
'use client';

import { RideHistoryTable } from "@/components/ride-history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const translations = {
  ur: {
    title: "Tamam Rides",
    description: "System mein mojood tamam rides ki history dekhein.",
  },
  en: {
    title: "All Rides",
    description: "View history of all rides in the system.",
  }
};

export default function AdminRidesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RideHistoryTable />
      </CardContent>
    </Card>
  )
}
