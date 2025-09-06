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
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import type { RideRequest } from "@/lib/types";
import { format } from "date-fns";

const translations = {
  ur: {
    rideId: "Ride ID",
    date: "Tareekh",
    pickup: "Uthanay ki Jagah",
    dropoff: "Manzil",
    fare: "Kiraya (PKR)",
    status: "Status",
    completed: "Mukammal",
    cancelled: "Mansookh",
    noHistory: "Koi ride history nahi hai.",
  },
  en: {
    rideId: "Ride ID",
    date: "Date",
    pickup: "Pickup",
    dropoff: "Dropoff",
    fare: "Fare (PKR)",
    status: "Status",
    completed: "Completed",
    cancelled: "Cancelled",
    noHistory: "No ride history available.",
  },
};

const statusConfig = {
    completed: { variant: 'secondary', className: 'bg-green-100 text-green-800' },
    cancelled_by_driver: { variant: 'destructive', className: 'bg-red-100 text-red-800' },
    cancelled_by_customer: { variant: 'destructive', className: 'bg-red-100 text-red-800' },
}

export function RideHistoryTable({ userType = 'rider' }: { userType?: 'rider' | 'customer' | 'admin' }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    const fetchRides = async () => {
        if (!user && userType !== 'admin') {
            setLoading(false);
            return;
        }
        
        try {
            let q;
            const ridesRef = collection(db, "rides");
            const statusFilter = where('status', 'in', ['completed', 'cancelled_by_driver', 'cancelled_by_customer']);

            if (userType === 'admin') {
                q = query(ridesRef, statusFilter);
            } else if (userType === 'rider') {
                 q = query(ridesRef, where("driverId", "==", user?.uid), statusFilter);
            } else { // customer
                 q = query(ridesRef, where("customerId", "==", user?.uid), statusFilter);
            }

            const querySnapshot = await getDocs(q);
            const ridesData = querySnapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
            })) as RideRequest[];
            
            // Sort client-side
            ridesData.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));

            setRides(ridesData);
        } catch (error) {
            console.error("Error fetching ride history: ", error);
        } finally {
            setLoading(false);
        }
    };

    fetchRides();
  }, [user, userType]);

  const getStatusLabel = (status: RideRequest['status']) => {
    if (status === 'completed') return t.completed;
    return t.cancelled;
  }

  if (loading) {
    return <div className="text-center text-muted-foreground py-16">Loading history...</div>
  }

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
              <TableHead className="text-center">{t.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.map((ride) => {
               const config = statusConfig[ride.status as keyof typeof statusConfig] || { variant: 'default', className: '' };
               return (
                  <TableRow key={ride.id}>
                    <TableCell className="font-medium">{ride.id.substring(0, 8)}</TableCell>
                    <TableCell>{format(new Date(ride.createdAt as any), 'PP')}</TableCell>
                    <TableCell>{ride.pickup}</TableCell>
                    <TableCell>{ride.dropoff}</TableCell>
                    <TableCell className="text-right">{(ride.fare || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={config.variant as any} className={config.className}>{getStatusLabel(ride.status)}</Badge>
                    </TableCell>
                  </TableRow>
               )
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          {t.noHistory}
        </div>
      )}
    </div>
  )
}
