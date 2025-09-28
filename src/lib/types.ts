
import { FieldValue, GeoPoint } from "firebase/firestore";

export interface RideRequest {
    id: string;
    customerId: string;
    customerName: string;
    customerAvatar?: string;
    pickup: string;
    dropoff: string;
    status: 'booked' | 'searching' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled_by_customer' | 'cancelled_by_driver';
    createdAt: FieldValue | Date;
    vehicleType?: 'Car' | 'Bike' | 'Rickshaw';
    fare?: number;
    driverId?: string;
    driverName?: string;
    driverAvatar?: string;
    tip?: number;
    rating?: number;
    feedback?: string;
    eta?: string;
    rider?: {
        name: string;
        rating: number;
        phone: string;
        avatarUrl: string;
    };
    pickupCoords: GeoPoint;
    dropoffCoords: GeoPoint;
}
