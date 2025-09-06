'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    title: "Live Fleet & Customer Map",
    description: "Yeh feature filhaal dastyaab nahi hai.",
    mapRemoved: "Map feature ko technical masail ki wajah se aarzi tor par hata diya gaya hai. Hum jald hi isay behtar bana kar wapas layenge."
  },
  en: {
    title: "Live Fleet & Customer Map",
    description: "This feature is currently unavailable.",
    mapRemoved: "The map feature has been temporarily removed due to technical issues. We will bring it back soon with improvements."
  }
};

function LiveMapPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col h-full gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-96">
                <p>{t.mapRemoved}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default LiveMapPage;
