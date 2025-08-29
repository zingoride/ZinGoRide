
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RideHistoryTable } from "@/components/ride-history-table";
import { useLanguage } from "@/context/LanguageContext";

const translations = {
    ur: {
        title: "My Rides",
        description: "Aap ki tamam pichli rides ki tafseelat."
    },
    en: {
        title: "My Rides",
        description: "Details of all your past rides."
    }
}

export default function CustomerRidesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="p-4 md:p-8">
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
