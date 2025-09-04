
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

const translations = {
  ur: {
    rideId: "Ride ID",
    date: "Tareekh",
    pickup: "Uthanay ki Jagah",
    dropoff: "Manzil",
    fare: "Kiraya (PKR)",
    tip: "Tip (PKR)",
    total: "Kul (PKR)",
    status: "Status",
  },
  en: {
    rideId: "Ride ID",
    date: "Date",
    pickup: "Pickup",
    dropoff: "Dropoff",
    fare: "Fare (PKR)",
    tip: "Tip (PKR)",
    total: "Total (PKR)",
    status: "Status",
  },
};

export function RideHistoryTable() {
  const { language } = useLanguage();
  const [rides, setRides] = useState<any[]>([]);
  const t = translations[language];

  return (
    <div className="w-full border rounded-lg">
      {rides.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.rideId}</TableHead>
              <TableHead>{t.date}</TableHead>
              <TableHead>{t.pickup}</TableHead>
              <TableHead>{t.dropoff}</TableHead>
              <TableHead className="text-right">{t.fare}</TableHead>
              <TableHead className="text-right">{t.tip}</TableHead>
              <TableHead className="text-right">{t.total}</TableHead>
              <TableHead className="text-center">{t.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell className="font-medium">{ride.id}</TableCell>
                <TableCell>{ride.date}</TableCell>
                <TableCell>{ride.pickup}</TableCell>
                <TableCell>{ride.dropoff}</TableCell>
                <TableCell className="text-right">{ride.fare.toFixed(2)}</TableCell>
                <TableCell className="text-right">{ride.tip.toFixed(2)}</TableCell>
                <TableCell className="text-right font-semibold">{(ride.fare + ride.tip).toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">{language === 'ur' ? ride.statusUr : ride.statusEn}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          No ride history available.
        </div>
      )}
    </div>
  )
}
