
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RideHistoryTable } from "@/components/ride-history-table";
import { useLanguage } from "@/context/LanguageContext";

const translations = {
    ur: {
        title: "Ride History",
        description: "Aap ki tamam pichli rides ki tafseelat."
    },
    en: {
        title: "Ride History",
        description: "Details of all your past rides."
    }
}

export default function HistoryPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <RideHistoryTable />
        </CardContent>
      </Card>
    </div>
  );
}
