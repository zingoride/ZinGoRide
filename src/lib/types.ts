import { FieldValue } from "firebase/firestore";

export interface RideRequest {
    id: string;
    customerId: string;
    customerName: string;
    customerAvatar?: string;
    pickup: string;
    dropoff: string;
    status: 'pending' | 'booked' | 'accepted' | 'enroute_to_pickup' | 'at_pickup' | 'in_progress' | 'completed' | 'cancelled_by_customer' | 'cancelled_by_driver';
    createdAt: FieldValue;
    vehicleType?: 'Car' | 'Bike' | 'Rickshaw';
    fare?: number;
    driverId?: string;
    driverName?: string;
    driverAvatar?: string;
    tip?: number;
    rating?: number;
    feedback?: string;
}
