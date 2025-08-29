
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

export function RideBookingForm() {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <div className="grid gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="pickup"
              placeholder="Uthanay ki jagah?"
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="dropoff"
              placeholder="Kahan jana hai?"
              className="pl-10"
            />
          </div>
          <Button className="w-full">
            <ArrowRight className="mr-2 h-4 w-4" /> Ride Dhundein
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
