import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const rides = [
  {
    id: "ZR-86571",
    date: "June 28, 2024",
    pickup: "North Nazimabad",
    dropoff: "Tariq Road",
    fare: 550,
    tip: 50,
    status: "Mukammal",
  },
  {
    id: "ZR-86570",
    date: "June 28, 2024",
    pickup: "Gulshan-e-Iqbal",
    dropoff: "Saddar",
    fare: 400,
    tip: 0,
    status: "Mukammal",
  },
  {
    id: "ZR-86569",
    date: "June 27, 2024",
    pickup: "DHA Phase 6",
    dropoff: "I.I. Chundrigar Road",
    fare: 750,
    tip: 100,
    status: "Mukammal",
  },
  {
    id: "ZR-86568",
    date: "June 27, 2024",
    pickup: "Bahadurabad",
    dropoff: "Sea View",
    fare: 350,
    tip: 20,
    status: "Mukammal",
  },
    {
    id: "ZR-86567",
    date: "June 26, 2024",
    pickup: "Airport",
    dropoff: "Federal B Area",
    fare: 900,
    tip: 150,
    status: "Mukammal",
  },
];

export function RideHistoryTable() {
  return (
    <div className="w-full border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ride ID</TableHead>
            <TableHead>Tareekh</TableHead>
            <TableHead>Uthanay ki Jagah</TableHead>
            <TableHead>Manzil</TableHead>
            <TableHead className="text-right">Kiraya (PKR)</TableHead>
            <TableHead className="text-right">Tip (PKR)</TableHead>
            <TableHead className="text-right">Kul (PKR)</TableHead>
             <TableHead className="text-center">Status</TableHead>
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
                 <Badge variant="secondary" className="bg-green-100 text-green-800">{ride.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
