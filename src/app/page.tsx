import { RideRequest } from "@/components/ride-request";
import { TipCalculator } from "@/components/tip-calculator";

const rideRequests = [
  { id: "ZR-86572", pickup: "Saddar, Karachi", dropoff: "Clifton, Karachi", fare: 450, eta: "8 Minutes" },
  { id: "ZR-86573", pickup: "Gulshan-e-Iqbal", dropoff: "DHA Phase 8", fare: 600, eta: "15 Minutes" },
  { id: "ZR-86574", pickup: "North Nazimabad", dropoff: "Tariq Road", fare: 350, eta: "12 Minutes" },
  { id: "ZR-86575", pickup: "Bahadurabad", dropoff: "I.I. Chundrigar Road", fare: 500, eta: "10 Minutes" },
  { id: "ZR-86576", pickup: "Shahrah-e-Faisal", dropoff: "Airport", fare: 700, eta: "20 Minutes" },
  { id: "ZR-86577", pickup: "Korangi", dropoff: "Landhi", fare: 250, eta: "7 Minutes" },
  { id: "ZR-86578", pickup: "Federal B Area", dropoff: "Buffer Zone", fare: 300, eta: "9 Minutes" },
  { id: "ZR-86579", pickup: "Defence View", dropoff: "PECHS", fare: 400, eta: "11 Minutes" },
  { id: "ZR-86580", pickup: "Malir Cantt", dropoff: "Jinnah Terminal", fare: 200, eta: "5 Minutes" },
  { id: "ZR-86581", pickup: "Lyari", dropoff: "Keamari", fare: 550, eta: "18 Minutes" },
];

export default function Home() {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4">
          {rideRequests.map((request) => (
            <RideRequest key={request.id} {...request} />
          ))}
        </div>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <TipCalculator />
      </div>
    </div>
  );
}
