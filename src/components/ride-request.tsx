
"use client";

import { useState, useEffect } from "react";
import { MapPin, DollarSign, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRide, RideDetails } from "@/context/RideContext";
import { useLanguage } from "@/context/LanguageContext";


const translations = {
    ur: {
        newRideRequest: "Nayi Ride Ki Darkhwast",
        rideId: "Ride ID",
        reject: "Mustarad Karein",
        accept: "Qubool Karein",
        pickupLocation: "Uthanay ki Jagah",
        dropoffLocation: "Manzil",
        estimatedFare: "Andazan Kiraya",
        eta: "Pohanchne ka Waqt",
    },
    en: {
        newRideRequest: "New Ride Request",
        rideId: "Ride ID",
        reject: "Reject",
        accept: "Accept",
        pickupLocation: "Pickup Location",
        dropoffLocation: "Destination",
        estimatedFare: "Estimated Fare",
        eta: "ETA",
    }
}

export function RideRequest(props: RideDetails) {
  const { id, pickup, dropoff, fare, eta } = props;
  const [timeLeft, setTimeLeft] = useState(10);
  const [isExpired, setIsExpired] = useState(false);
  const { acceptRide } = useRide();
  const { language } = useLanguage();
  const t = translations[language];


  useEffect(() => {
    if (timeLeft === 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const handleAccept = () => {
    acceptRide(props);
  };

  return (
    <Card className={`overflow-hidden shadow-lg transition-opacity duration-500 ${isExpired ? 'opacity-50' : ''}`}>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {t.newRideRequest}
          </CardTitle>
          <CardDescription>{t.rideId}: #{id}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
              {timeLeft}
            </div>
          <Button size="sm" variant="outline" className="h-8 gap-1" disabled={isExpired}>
            {t.reject}
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-green-600 hover:bg-green-700" disabled={isExpired} onClick={handleAccept}>
            {t.accept}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
          <div className="grid gap-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-muted-foreground">{t.pickupLocation}</p>
                <p className="font-medium">{pickup}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground mx-4" />
              <div className="flex-1 text-right">
                <p className="font-semibold text-muted-foreground">{t.dropoffLocation}</p>
                <p className="font-medium">{dropoff}</p>
              </div>
              <MapPin className="h-5 w-5 text-accent ml-3" />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-semibold text-muted-foreground">{t.estimatedFare}</p>
                  <p className="font-medium">PKR {fare.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="font-semibold text-muted-foreground">{t.eta}</p>
                  <p className="font-medium">{eta}</p>
                </div>
              </div>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
