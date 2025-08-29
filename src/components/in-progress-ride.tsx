'use client';

import Image from 'next/image';
import {
  Map,
  MapPin,
  Phone,
  MessageSquare,
  X,
  Star,
  Navigation,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useRide } from '@/context/RideContext';

export function InProgressRide() {
  const { activeRide, completeRide, cancelRide } = useRide();

  if (!activeRide) {
    return null;
  }

  const { pickup, dropoff, rider } = activeRide;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
      <div className="lg:col-span-2 h-[calc(100vh-10rem)] rounded-lg overflow-hidden">
        <Image
          src="https://picsum.photos/seed/map/1600/1200"
          alt="Map with route"
          layout="fill"
          objectFit="cover"
          data-ai-hint="street map"
        />
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rider ki Maloomat</CardTitle>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={rider?.avatarUrl} data-ai-hint="portrait woman" />
                <AvatarFallback>
                  {rider?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold">{rider?.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{rider?.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safar ki Tafseelat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Uthanay ki Jagah</p>
                <p className="font-semibold">{pickup}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Manzil</p>
                <p className="font-semibold">{dropoff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className='space-y-2'>
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                <Navigation className="mr-2 h-5 w-5" />
                Navigate to Pickup
            </Button>
            <Button size="lg" className="w-full" onClick={completeRide}>
                Ride Mukammal Karein
            </Button>
             <Button variant="destructive" size="lg" className="w-full" onClick={cancelRide}>
                <X className="mr-2 h-5 w-5" />
                Ride Mansookh Karein
            </Button>
        </div>

      </div>
    </div>
  );
}
