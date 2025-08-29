
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    pickupPlaceholder: "Uthanay ki jagah?",
    dropoffPlaceholder: "Kahan jana hai?",
    findRideButton: "Ride Dhundein",
  },
  en: {
    pickupPlaceholder: "Pickup location?",
    dropoffPlaceholder: "Where to?",
    findRideButton: "Find Ride",
  }
}

export function RideBookingForm({ onFindRide }: { onFindRide: () => void }) {
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindRide();
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="pickup"
              placeholder={t.pickupPlaceholder}
              className="pl-10"
              defaultValue="Saddar, Karachi"
              required
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="dropoff"
              placeholder={t.dropoffPlaceholder}
              className="pl-10"
              defaultValue="Clifton, Karachi"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <ArrowRight className="mr-2 h-4 w-4" /> {t.findRideButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
