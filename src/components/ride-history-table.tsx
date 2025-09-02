
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

const rides = [
  {
    id: "ZR-86571",
    date: "June 28, 2024",
    pickup: "North Nazimabad",
    dropoff: "Tariq Road",
    fare: 550,
    tip: 50,
    statusUr: "Mukammal",
    statusEn: "Completed",
  },
  {
    id: "ZR-86570",
    date: "June 28, 2024",
    pickup: "Gulshan-e-Iqbal",
    dropoff: "Saddar",
    fare: 400,
    tip: 0,
    statusUr: "Mukammal",
    statusEn: "Completed",
  },
  {
    id: "ZR-86569",
    date: "June 27, 2024",
    pickup: "DHA Phase 6",
    dropoff: "I.I. Chundrigar Road",
    fare: 750,
    tip: 100,
    statusUr: "Mukammal",
    statusEn: "Completed",
  },
  {
    id: "ZR-86568",
    date: "June 27, 2024",
    pickup: "Bahadurabad",
    dropoff: "Sea View",
    fare: 350,
    tip: 20,
    statusUr: "Mukammal",
    statusEn: "Completed",
  },
    {
    id: "ZR-86567",
    date: "June 26, 2024",
    pickup: "Airport",
    dropoff: "Federal B Area",
    fare: 900,
    tip: 150,
    statusUr: "Mukammal",
    statusEn: "Completed",
  },
];

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
  const t = translations[language];

  return (
    <div className="w-full border rounded-lg">
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
    </div>
  )
}
