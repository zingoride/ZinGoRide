'use client';

import { useState, useEffect } from 'react';
import { RideRequest } from '@/components/ride-request';
import { TipCalculator } from '@/components/tip-calculator';

const initialRideRequests = [
  {
    id: 'ZR-86572',
    pickup: 'Saddar, Karachi',
    dropoff: 'Clifton, Karachi',
    fare: 450,
    eta: '8 Minutes',
  },
  {
    id: 'ZR-86573',
    pickup: 'Gulshan-e-Iqbal',
    dropoff: 'DHA Phase 8',
    fare: 600,
    eta: '15 Minutes',
  },
  {
    id: 'ZR-86574',
    pickup: 'North Nazimabad',
    dropoff: 'Tariq Road',
    fare: 350,
    eta: '12 Minutes',
  },
  {
    id: 'ZR-86575',
    pickup: 'Bahadurabad',
    dropoff: 'I.I. Chundrigar Road',
    fare: 500,
    eta: '10 Minutes',
  },
  {
    id: 'ZR-86576',
    pickup: 'Shahrah-e-Faisal',
    dropoff: 'Airport',
    fare: 700,
    eta: '20 Minutes',
  },
  {
    id: 'ZR-86577',
    pickup: 'Korangi',
    dropoff: 'Landhi',
    fare: 250,
    eta: '7 Minutes',
  },
  {
    id: 'ZR-86578',
    pickup: 'Federal B Area',
    dropoff: 'Buffer Zone',
    fare: 300,
    eta: '9 Minutes',
  },
  {
    id: 'ZR-86579',
    pickup: 'Defence View',
    dropoff: 'PECHS',
    fare: 400,
    eta: '11 Minutes',
  },
  {
    id: 'ZR-86580',
    pickup: 'Malir Cantt',
    dropoff: 'Jinnah Terminal',
    fare: 200,
    eta: '5 Minutes',
  },
  {
    id: 'ZR-86581',
    pickup: 'Lyari',
    dropoff: 'Keamari',
    fare: 550,
    eta: '18 Minutes',
  },
];

const nearbyPickups = [
  'Tariq Road',
  'Bahadurabad',
  'Saddar',
  'Clifton',
  'DHA Phase 5',
];
const nearbyDropoffs = [
  'Gulshan-e-Iqbal',
  'North Nazimabad',
  'PECHS',
  'I.I. Chundrigar Road',
  'Sea View',
];

function generateNewRide(existingIds: Set<string>) {
  let newIdNumber;
  let newId;
  do {
    newIdNumber = 86582 + Math.floor(Math.random() * 100);
    newId = `ZR-${newIdNumber}`;
  } while (existingIds.has(newId));

  const pickup =
    nearbyPickups[Math.floor(Math.random() * nearbyPickups.length)];
  const dropoff =
    nearbyDropoffs[Math.floor(Math.random() * nearbyDropoffs.length)];
  const fare = 200 + Math.floor(Math.random() * 6) * 50; // 200 to 450
  const eta = `${5 + Math.floor(Math.random() * 10)} Minutes`;

  return { id: newId, pickup, dropoff, fare, eta };
}

export default function Home() {
  const [rideRequests, setRideRequests] = useState(initialRideRequests);

  useEffect(() => {
    const interval = setInterval(() => {
      setRideRequests((prevRequests) => {
        const existingIds = new Set(prevRequests.map((r) => r.id));
        const newRide = generateNewRide(existingIds);
        return [newRide, ...prevRequests];
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

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
